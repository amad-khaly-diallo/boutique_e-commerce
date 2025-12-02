import { connect } from "./db";

export async function addToCart(userId, productId, quantity = 1) {
    const conn = await connect();

    // 1. Vérifie si le user a déjà un panier
    const [cartRows] = await conn.execute(
        "SELECT cart_id FROM Cart WHERE user_id = ? LIMIT 1",
        [userId]
    );

    let cartId;

    if (cartRows.length === 0) {
        // créer un panier
        const [result] = await conn.execute(
            "INSERT INTO Cart (user_id) VALUES (?)",
            [userId]
        );
        cartId = result.insertId;
    } else {
        cartId = cartRows[0].cart_id;
    }

    // 2. Vérifie si le produit existe déjà dans Cart_item
    const [itemRows] = await conn.execute(
        "SELECT * FROM Cart_item WHERE cart_id = ? AND product_id = ?",
        [cartId, productId]
    );

    if (itemRows.length > 0) {
        // met à jour la quantité
        await conn.execute(
            "UPDATE Cart_item SET quantity = quantity + ? WHERE cart_item_id = ?",
            [quantity, itemRows[0].cart_item_id]
        );
    } else {
        // ajoute l’item
        await conn.execute(
            "INSERT INTO Cart_item (cart_id, product_id, quantity) VALUES (?, ?, ?)",
            [cartId, productId, quantity]
        );
    }

    return { success: true, cartId };
}

export async function getUserCart(userId) {
    const conn = await connect();

    const [carts] = await conn.execute(
        "SELECT cart_id FROM Cart WHERE user_id = ? LIMIT 1",
        [userId]
    );

    if (carts.length === 0) return [];

    const cartId = carts[0].cart_id;

    const [items] = await conn.execute(
        `SELECT 
            Cart_item.cart_item_id,
            Cart_item.quantity,
            Product.product_id,
            Product.product_name,
            Product.price,
            Product.image
        FROM Cart_item
        INNER JOIN Product ON Cart_item.product_id = Product.product_id
        WHERE Cart_item.cart_id = ?`,
        [cartId]
    );

    return items;
}

export async function updateCartItem(cartItemId, quantity) {
    const conn = await connect();

    await conn.execute(
        "UPDATE Cart_item SET quantity = ? WHERE cart_item_id = ?",
        [quantity, cartItemId]
    );

    return { success: true };
}

export async function deleteCartItem(cartItemId) {
    const conn = await connect();

    await conn.execute(
        "DELETE FROM Cart_item WHERE cart_item_id = ?",
        [cartItemId]
    );

    return { success: true };
}

