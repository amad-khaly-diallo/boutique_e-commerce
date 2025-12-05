"use client";
import { useEffect, useState } from "react";
import Golden from "../components/GoldenBotton/GoldenBotton";
import Image from "next/image";
import "./checkout.css";
import LuxuryLoader from "@/app/components/LuxuryLoader/LuxuryLoader";
import Link from "next/link";
import { useLuxuryLoader } from "@/lib/useLuxuryLoader";
import { useToastContext } from "@/app/contexts/ToastContext";
import {
  validatePaymentData,
  validateCardNumber,
  validateCardHolder,
  validateExpiryDate,
  validateCVV,
  formatCardNumber,
  formatExpiryDate,
} from "@/lib/paymentValidation";

const STEPS = {
  CART: 1,
  DELIVERY: 2,
  BILLING: 3,
  PAYMENT: 4,
  CONFIRMATION: 5,
};

function emptyAddress() {
  return {
    prenom: "",
    nom: "",
    societe: "",
    adresse: "",
    apt: "",
    ville: "",
    codePostal: "",
    pays: "",
    telephone: "",
    parDefaut: false,
  };
}

function emptyPayment() {
  return {
    titulaire: "",
    type: "Visa",
    numero: "",
    expiry: "",
    cvv: "",
    parDefaut: false,
  };
}

export default function Checkout() {
  const [loading, setLoading] = useState(true);
  const showLoader = useLuxuryLoader(loading, 1000);
  const toast = useToastContext();
  const [currentStep, setCurrentStep] = useState(STEPS.CART);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  
  // Adresses
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [newDeliveryAddress, setNewDeliveryAddress] = useState(emptyAddress());
  const [newBillingAddress, setNewBillingAddress] = useState(emptyAddress());
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [showNewDeliveryForm, setShowNewDeliveryForm] = useState(false);
  const [showNewBillingForm, setShowNewBillingForm] = useState(false);
  
  // Paiement
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newPayment, setNewPayment] = useState(emptyPayment());
  const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
  
  const [placing, setPlacing] = useState(false);
  const [user, setUser] = useState(null);

  const shipping = 0;
  const total = subtotal + shipping;

  // Charger le panier
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await fetch("/api/carts", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (res.ok && Array.isArray(data.cart)) {
          if (data.cart.length === 0) {
            toast.warning("Votre panier est vide. Redirection vers la boutique...");
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
            return;
          }
          setCartItems(data.cart);
          const s = data.cart.reduce(
            (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
            0,
          );
          setSubtotal(s);
        } else {
          setCartItems([]);
          toast.warning("Votre panier est vide. Redirection vers la boutique...");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      } catch (err) {
        console.error(err);
        setCartItems([]);
      } finally {
        // Le loader sera visible au minimum 1000ms grâce à useLuxuryLoader
        setTimeout(() => setLoading(false), 500); // Temps réel de chargement (peut être rapide)
      }
    };
    loadCart();
  }, []);

  // Charger l'utilisateur
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.user) {
          setUser(data.user);
        } else {
          // Utilisateur non connecté, rediriger vers login
          toast.warning("Vous devez être connecté pour passer commande.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } catch (err) {
        console.error(err);
        toast.error("Erreur de connexion. Redirection vers la page de connexion...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    };
    loadUser();
  }, []);

  // Charger les adresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await fetch("/api/addresses", { credentials: "include" });
        const data = await res.json().catch(() => []);
        if (Array.isArray(data)) {
          setDeliveryAddresses(data);
          setBillingAddresses(data);
          // Sélectionner l'adresse par défaut si elle existe
          const defaultAddr = data.find(a => a.parDefaut);
          if (defaultAddr) {
            setSelectedDeliveryAddress(defaultAddr.address_id);
            setSelectedBillingAddress(defaultAddr.address_id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (currentStep >= STEPS.DELIVERY) {
      loadAddresses();
    }
  }, [currentStep]);

  // Charger les méthodes de paiement
  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res = await fetch("/api/payments", { credentials: "include" });
        const data = await res.json().catch(() => []);
        if (Array.isArray(data)) {
          setPaymentMethods(data);
          // Sélectionner la méthode par défaut si elle existe
          const defaultPayment = data.find(p => p.parDefaut);
          if (defaultPayment) {
            setSelectedPayment(defaultPayment.payment_id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (currentStep >= STEPS.PAYMENT) {
      loadPayments();
    }
  }, [currentStep]);

  // Validation étape 1: Panier
  function validateCart() {
    if (!cartItems || cartItems.length === 0) {
      toast.warning("Votre panier est vide. Veuillez ajouter des produits avant de continuer.");
      return false;
    }
    if (!user) {
      toast.warning("Vous devez être connecté pour passer commande.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return false;
    }
    return true;
  }

  // Validation étape 2: Adresse de livraison
  function validateDelivery() {
    if (showNewDeliveryForm) {
      const addr = newDeliveryAddress;
      if (!addr.prenom || !addr.nom || !addr.adresse || !addr.ville) {
        toast.warning("Veuillez remplir tous les champs requis pour l'adresse de livraison.");
        return false;
      }
    } else if (!selectedDeliveryAddress) {
      toast.warning("Veuillez sélectionner ou créer une adresse de livraison.");
      return false;
    }
    return true;
  }

  // Validation étape 3: Adresse de facturation
  function validateBilling() {
    if (useSameAddress) {
      return true; // Utilise l'adresse de livraison
    }
    if (showNewBillingForm) {
      const addr = newBillingAddress;
      if (!addr.prenom || !addr.nom || !addr.adresse || !addr.ville) {
        toast.warning("Veuillez remplir tous les champs requis pour l'adresse de facturation.");
        return false;
      }
    } else if (!selectedBillingAddress) {
      toast.warning("Veuillez sélectionner ou créer une adresse de facturation.");
      return false;
    }
    return true;
  }

  // Validation étape 4: Paiement
  function validatePayment() {
    if (showNewPaymentForm) {
      const pay = newPayment;
      
      // Validation complète avec les fonctions de sécurité
      const validation = validatePaymentData(pay);
      
      if (!validation.valid) {
        // Afficher la première erreur trouvée
        const firstError = Object.values(validation.errors)[0];
        toast.warning(firstError || "Veuillez remplir tous les champs requis pour la méthode de paiement.");
        return false;
      }
    } else if (!selectedPayment) {
      toast.warning("Veuillez sélectionner ou ajouter une méthode de paiement.");
      return false;
    }
    return true;
  }

  // Sauvegarder nouvelle adresse de livraison
  async function saveDeliveryAddress() {
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newDeliveryAddress),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'enregistrement de l'adresse.");
        return false;
      }
      toast.success("Adresse enregistrée avec succès");
      setSelectedDeliveryAddress(data.address_id);
      setShowNewDeliveryForm(false);
      setNewDeliveryAddress(emptyAddress());
      // Recharger les adresses
      const listRes = await fetch("/api/addresses", { credentials: "include" });
      const listData = await listRes.json().catch(() => []);
      if (Array.isArray(listData)) {
        setDeliveryAddresses(listData);
      }
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Impossible d'enregistrer l'adresse.");
      return false;
    }
  }

  // Sauvegarder nouvelle adresse de facturation
  async function saveBillingAddress() {
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newBillingAddress),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'enregistrement de l'adresse.");
        return false;
      }
      toast.success("Adresse enregistrée avec succès");
      setSelectedBillingAddress(data.address_id);
      setShowNewBillingForm(false);
      setNewBillingAddress(emptyAddress());
      // Recharger les adresses
      const listRes = await fetch("/api/addresses", { credentials: "include" });
      const listData = await listRes.json().catch(() => []);
      if (Array.isArray(listData)) {
        setBillingAddresses(listData);
      }
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Impossible d'enregistrer l'adresse.");
      return false;
    }
  }

  // Sauvegarder nouvelle méthode de paiement
  async function savePaymentMethod() {
    try {
      // Valider les données avant l'envoi
      const validation = validatePaymentData(newPayment);
      if (!validation.valid) {
        const firstError = Object.values(validation.errors)[0];
        toast.warning(firstError || "Veuillez corriger les erreurs dans le formulaire.");
        return false;
      }

      // Nettoyer et préparer les données
      const cardNumberValidation = validateCardNumber(newPayment.numero, newPayment.type);
      const holderValidation = validateCardHolder(newPayment.titulaire);
      const expiryValidation = validateExpiryDate(newPayment.expiry);

      // Ne pas envoyer le CVV (sécurité)
      const { cvv, ...payload } = newPayment;
      
      // Utiliser les valeurs nettoyées
      payload.numero = cardNumberValidation.cleaned;
      payload.titulaire = holderValidation.cleaned;
      payload.expiry = expiryValidation.cleaned;

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'enregistrement de la méthode de paiement.");
        return false;
      }
      toast.success("Méthode de paiement enregistrée avec succès");
      setSelectedPayment(data.payment_id);
      setShowNewPaymentForm(false);
      setNewPayment(emptyPayment());
      // Recharger les méthodes de paiement
      const listRes = await fetch("/api/payments", { credentials: "include" });
      const listData = await listRes.json().catch(() => []);
      if (Array.isArray(listData)) {
        setPaymentMethods(listData);
      }
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Impossible d'enregistrer la méthode de paiement.");
      return false;
    }
  }

  // Navigation entre les étapes
  async function nextStep() {
    if (currentStep === STEPS.CART) {
      if (!validateCart()) return;
      setCurrentStep(STEPS.DELIVERY);
    } else if (currentStep === STEPS.DELIVERY) {
      if (showNewDeliveryForm) {
        const saved = await saveDeliveryAddress();
        if (!saved) return;
      }
      if (!validateDelivery()) return;
      setCurrentStep(STEPS.BILLING);
    } else if (currentStep === STEPS.BILLING) {
      if (!useSameAddress && showNewBillingForm) {
        const saved = await saveBillingAddress();
        if (!saved) return;
      }
      if (!validateBilling()) return;
      setCurrentStep(STEPS.PAYMENT);
    } else if (currentStep === STEPS.PAYMENT) {
      if (showNewPaymentForm) {
        const saved = await savePaymentMethod();
        if (!saved) return;
      }
      if (!validatePayment()) return;
      setCurrentStep(STEPS.CONFIRMATION);
    }
  }

  function prevStep() {
    if (currentStep > STEPS.CART) {
      setCurrentStep(currentStep - 1);
    }
  }

  // Créer la commande
  async function placeOrder() {
    if (!validateCart() || !validateDelivery() || !validateBilling() || !validatePayment()) {
      return;
    }

    setPlacing(true);
    try {
      // Récupérer les adresses complètes
      let deliveryAddr = null;
      let billingAddr = null;

      if (selectedDeliveryAddress) {
        const addrRes = await fetch(`/api/addresses/${selectedDeliveryAddress}`, {
          credentials: "include",
        });
        const addrData = await addrRes.json().catch(() => ({}));
        if (addrRes.ok) {
          deliveryAddr = addrData;
        }
      }

      if (useSameAddress) {
        billingAddr = deliveryAddr;
      } else if (selectedBillingAddress) {
        const addrRes = await fetch(`/api/addresses/${selectedBillingAddress}`, {
        credentials: "include",
      });
        const addrData = await addrRes.json().catch(() => ({}));
        if (addrRes.ok) {
          billingAddr = addrData;
        }
      }

      if (!deliveryAddr) {
        toast.error("Erreur: adresse de livraison introuvable.");
        setPlacing(false);
        return;
      }

      // Formater l'adresse pour la commande
      const addressString = `${deliveryAddr.prenom} ${deliveryAddr.nom}, ${deliveryAddr.adresse}${deliveryAddr.apt ? ` ${deliveryAddr.apt}` : ""}, ${deliveryAddr.ville}${deliveryAddr.codePostal ? ` ${deliveryAddr.codePostal}` : ""}${deliveryAddr.pays ? `, ${deliveryAddr.pays}` : ""}${deliveryAddr.telephone ? ` - ${deliveryAddr.telephone}` : ""}`;

      const orderPayload = {
        user_id: user.user_id,
        address: addressString,
        total_amount: total,
        status: "pending",
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price_unit: item.price,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erreur lors de la création de la commande.");
        setPlacing(false);
        return;
      }

      // Vider le panier après commande réussie
      try {
        for (const item of cartItems) {
          await fetch("/api/carts/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ cartItemId: item.cart_item_id }),
          });
        }
      } catch (err) {
        console.error("Erreur lors de la suppression du panier:", err);
      }

      toast.success("Commande enregistrée avec succès !");
      setTimeout(() => {
        window.location.href = "/account/orders";
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de passer la commande pour le moment.");
      setPlacing(false);
    }
  }

  // Rendu étape 1: Panier
  function renderCartStep() {
  return (
      <div className="checkout-step">
        <h2>Votre panier</h2>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Votre panier est vide.</p>
            <Link href="/" className="btn btn-primary">Continuer les achats</Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.cart_item_id} className="cart-row">
                  <Image src={item.image || "/images/lux.png"} alt={item.product_name} width={60} height={60} />
                  <div className="cart-info">
                    <div className="cart-title">{item.product_name}</div>
                    <div className="small">Qté : {item.quantity}</div>
                  </div>
                  <div className="cart-price">
                    €{Number(item.price || 0) * Number(item.quantity || 1).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="totals">
              <div className="totals-row">
                <span>Sous-total :</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="totals-row">
                <span>Livraison :</span>
                <span>Gratuite</span>
              </div>
              <div className="totals-row total">
                <span>Total :</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Rendu étape 2: Adresse de livraison
  function renderDeliveryStep() {
    return (
      <div className="checkout-step">
        <h2>Adresse de livraison</h2>
        {!showNewDeliveryForm ? (
          <>
            <div className="address-list">
              {deliveryAddresses.map((addr) => (
                <div
                  key={addr.address_id}
                  className={`address-item ${selectedDeliveryAddress === addr.address_id ? "selected" : ""}`}
                  onClick={() => setSelectedDeliveryAddress(addr.address_id)}
                >
                  <div className="addr-main">
                    <div className="addr-name">
                      {addr.prenom} {addr.nom} {addr.societe ? `- ${addr.societe}` : ""}
                    </div>
                    <div className="addr-line">{addr.adresse} {addr.apt}</div>
                    <div className="addr-line">
                      {addr.ville} {addr.codePostal} {addr.pays}
                    </div>
                    <div className="addr-line">{addr.telephone}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-plain"
              onClick={() => setShowNewDeliveryForm(true)}
            >
              + Ajouter une nouvelle adresse
            </button>
          </>
        ) : (
          <form
            className="address-form"
            onSubmit={(e) => {
              e.preventDefault();
              saveDeliveryAddress().then((saved) => {
                if (saved) setShowNewDeliveryForm(false);
              });
            }}
          >
            <div className="row">
              <input
                placeholder="Prénom *"
                value={newDeliveryAddress.prenom}
                onChange={(e) =>
                  setNewDeliveryAddress({ ...newDeliveryAddress, prenom: e.target.value })
                }
                required
              />
              <input
                placeholder="Nom *"
                value={newDeliveryAddress.nom}
                onChange={(e) =>
                  setNewDeliveryAddress({ ...newDeliveryAddress, nom: e.target.value })
                }
                required
              />
            </div>
            <input
              placeholder="Société (optionnel)"
              value={newDeliveryAddress.societe}
              onChange={(e) =>
                setNewDeliveryAddress({ ...newDeliveryAddress, societe: e.target.value })
              }
            />
            <input
              placeholder="Adresse *"
              value={newDeliveryAddress.adresse}
              onChange={(e) =>
                setNewDeliveryAddress({ ...newDeliveryAddress, adresse: e.target.value })
              }
              required
            />
            <input
              placeholder="Appartement, étage (optionnel)"
              value={newDeliveryAddress.apt}
              onChange={(e) =>
                setNewDeliveryAddress({ ...newDeliveryAddress, apt: e.target.value })
              }
            />
            <div className="row">
              <input
                placeholder="Ville *"
                value={newDeliveryAddress.ville}
                onChange={(e) =>
                  setNewDeliveryAddress({ ...newDeliveryAddress, ville: e.target.value })
                }
                required
              />
              <input
                placeholder="Code postal"
                value={newDeliveryAddress.codePostal}
                onChange={(e) =>
                  setNewDeliveryAddress({ ...newDeliveryAddress, codePostal: e.target.value })
                }
              />
            </div>
            <div className="row">
              <input
                placeholder="Pays"
                value={newDeliveryAddress.pays}
                onChange={(e) =>
                  setNewDeliveryAddress({ ...newDeliveryAddress, pays: e.target.value })
                }
              />
              <input
                placeholder="Téléphone"
                value={newDeliveryAddress.telephone}
                onChange={(e) =>
                  setNewDeliveryAddress({ ...newDeliveryAddress, telephone: e.target.value })
                }
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Enregistrer</button>
              <button
                type="button"
                className="btn btn-plain"
                onClick={() => {
                  setShowNewDeliveryForm(false);
                  setNewDeliveryAddress(emptyAddress());
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // Rendu étape 3: Adresse de facturation
  function renderBillingStep() {
    return (
      <div className="checkout-step">
        <h2>Adresse de facturation</h2>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={useSameAddress}
            onChange={(e) => setUseSameAddress(e.target.checked)}
          />
          Utiliser la même adresse que la livraison
          </label>

        {!useSameAddress && (
          <>
            {!showNewBillingForm ? (
              <>
                <div className="address-list">
                  {billingAddresses.map((addr) => (
                    <div
                      key={addr.address_id}
                      className={`address-item ${selectedBillingAddress === addr.address_id ? "selected" : ""}`}
                      onClick={() => setSelectedBillingAddress(addr.address_id)}
                    >
                      <div className="addr-main">
                        <div className="addr-name">
                          {addr.prenom} {addr.nom} {addr.societe ? `- ${addr.societe}` : ""}
                        </div>
                        <div className="addr-line">{addr.adresse} {addr.apt}</div>
                        <div className="addr-line">
                          {addr.ville} {addr.codePostal} {addr.pays}
                        </div>
                        <div className="addr-line">{addr.telephone}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-plain"
                  onClick={() => setShowNewBillingForm(true)}
                >
                  + Ajouter une nouvelle adresse
                </button>
              </>
            ) : (
              <form
                className="address-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveBillingAddress().then((saved) => {
                    if (saved) setShowNewBillingForm(false);
                  });
                }}
              >
                <div className="row">
                  <input
                    placeholder="Prénom *"
                    value={newBillingAddress.prenom}
                    onChange={(e) =>
                      setNewBillingAddress({ ...newBillingAddress, prenom: e.target.value })
                    }
                    required
                  />
                  <input
                    placeholder="Nom *"
                    value={newBillingAddress.nom}
                    onChange={(e) =>
                      setNewBillingAddress({ ...newBillingAddress, nom: e.target.value })
                    }
                    required
                  />
                </div>
                <input
                  placeholder="Société (optionnel)"
                  value={newBillingAddress.societe}
                  onChange={(e) =>
                    setNewBillingAddress({ ...newBillingAddress, societe: e.target.value })
                  }
                />
                <input
                  placeholder="Adresse *"
                  value={newBillingAddress.adresse}
                  onChange={(e) =>
                    setNewBillingAddress({ ...newBillingAddress, adresse: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="Appartement, étage (optionnel)"
                  value={newBillingAddress.apt}
                  onChange={(e) =>
                    setNewBillingAddress({ ...newBillingAddress, apt: e.target.value })
                  }
                />
                <div className="row">
                  <input
                    placeholder="Ville *"
                    value={newBillingAddress.ville}
                    onChange={(e) =>
                      setNewBillingAddress({ ...newBillingAddress, ville: e.target.value })
                    }
                    required
                  />
                  <input
                    placeholder="Code postal"
                    value={newBillingAddress.codePostal}
                    onChange={(e) =>
                      setNewBillingAddress({ ...newBillingAddress, codePostal: e.target.value })
                    }
                  />
                </div>
                <div className="row">
                  <input
                    placeholder="Pays"
                    value={newBillingAddress.pays}
                    onChange={(e) =>
                      setNewBillingAddress({ ...newBillingAddress, pays: e.target.value })
                    }
                  />
                  <input
                    placeholder="Téléphone"
                    value={newBillingAddress.telephone}
                    onChange={(e) =>
                      setNewBillingAddress({ ...newBillingAddress, telephone: e.target.value })
                    }
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Enregistrer</button>
                  <button
                    type="button"
                    className="btn btn-plain"
                    onClick={() => {
                      setShowNewBillingForm(false);
                      setNewBillingAddress(emptyAddress());
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    );
  }

  // Rendu étape 4: Paiement
  function renderPaymentStep() {
    return (
      <div className="checkout-step">
        <h2>Méthode de paiement</h2>
        {!showNewPaymentForm ? (
          <>
            <div className="payment-list">
              {paymentMethods.map((pay) => (
                <div
                  key={pay.payment_id}
                  className={`payment-item ${selectedPayment === pay.payment_id ? "selected" : ""}`}
                  onClick={() => setSelectedPayment(pay.payment_id)}
                >
                  <div className="payment-main">
                    <div className="payment-type">{pay.type}</div>
                    <div className="payment-number">{pay.numero_masque}</div>
                    <div className="payment-holder">{pay.titulaire} • {pay.expiry}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-plain"
              onClick={() => setShowNewPaymentForm(true)}
            >
              + Ajouter une nouvelle carte
            </button>
          </>
        ) : (
          <form
            className="payment-form"
            onSubmit={(e) => {
              e.preventDefault();
              savePaymentMethod().then((saved) => {
                if (saved) setShowNewPaymentForm(false);
              });
            }}
          >
            <select
              value={newPayment.type}
              onChange={(e) =>
                setNewPayment({ ...newPayment, type: e.target.value })
              }
            >
              <option>Visa</option>
              <option>MasterCard</option>
              <option>American Express</option>
            </select>
            <input
              placeholder="Titulaire *"
              value={newPayment.titulaire}
              onChange={(e) => {
                const value = e.target.value;
                // Limiter la longueur et nettoyer les caractères dangereux
                if (value.length <= 50) {
                  setNewPayment({ ...newPayment, titulaire: value });
                }
              }}
              maxLength={50}
              required
            />
            <input
              placeholder="Numéro de carte *"
              value={newPayment.numero}
              onChange={(e) => {
                const value = e.target.value;
                // Nettoyer et formater le numéro de carte
                const formatted = formatCardNumber(value);
                // Limiter à 19 caractères (16 chiffres + 3 espaces)
                if (formatted.replace(/\s/g, "").length <= 16) {
                  setNewPayment({ ...newPayment, numero: formatted });
                }
              }}
              maxLength={19}
              required
            />
            <div className="row">
              <input
                placeholder="Expiration (MM/AA) *"
                value={newPayment.expiry}
                onChange={(e) => {
                  const value = e.target.value;
                  // Formater automatiquement la date
                  const formatted = formatExpiryDate(value);
                  if (formatted.length <= 5) {
                    setNewPayment({ ...newPayment, expiry: formatted });
                  }
                }}
                maxLength={5}
                required
              />
            <input
                placeholder="CVV *"
                type="password"
                value={newPayment.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  // Limiter selon le type de carte
                  const maxLength = newPayment.type === "American Express" ? 4 : 3;
                  if (value.length <= maxLength) {
                    setNewPayment({ ...newPayment, cvv: value });
                  }
                }}
                maxLength={4}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Enregistrer</button>
              <button
                type="button"
                className="btn btn-plain"
                onClick={() => {
                  setShowNewPaymentForm(false);
                  setNewPayment(emptyPayment());
                }}
              >
                Annuler
              </button>
          </div>
        </form>
        )}
                </div>
    );
  }

  // Rendu étape 5: Confirmation
  function renderConfirmationStep() {
    const deliveryAddr = deliveryAddresses.find(a => a.address_id === selectedDeliveryAddress);
    const billingAddr = useSameAddress
      ? deliveryAddr
      : billingAddresses.find(a => a.address_id === selectedBillingAddress);
    const payment = paymentMethods.find(p => p.payment_id === selectedPayment);

    return (
      <div className="checkout-step">
        <h2>Confirmation de commande</h2>
        <div className="confirmation-summary">
          <div className="summary-section">
            <h3>Articles</h3>
            {cartItems.map((item) => (
              <div key={item.cart_item_id} className="summary-row">
                <span>{item.product_name} x{item.quantity}</span>
                <span>€{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-section">
            <h3>Livraison</h3>
            {deliveryAddr && (
              <div className="summary-address">
                <div>{deliveryAddr.prenom} {deliveryAddr.nom}</div>
                <div>{deliveryAddr.adresse} {deliveryAddr.apt}</div>
                <div>{deliveryAddr.ville} {deliveryAddr.codePostal} {deliveryAddr.pays}</div>
                <div>{deliveryAddr.telephone}</div>
              </div>
            )}
          </div>

          <div className="summary-section">
            <h3>Facturation</h3>
            {billingAddr && (
              <div className="summary-address">
                <div>{billingAddr.prenom} {billingAddr.nom}</div>
                <div>{billingAddr.adresse} {billingAddr.apt}</div>
                <div>{billingAddr.ville} {billingAddr.codePostal} {billingAddr.pays}</div>
              </div>
            )}
          </div>

          <div className="summary-section">
            <h3>Paiement</h3>
            {payment && (
              <div className="summary-payment">
                <div>{payment.type}</div>
                <div>{payment.numero_masque}</div>
                <div>{payment.titulaire}</div>
              </div>
            )}
          </div>

          <div className="summary-section">
            <h3>Total</h3>
          <div className="totals">
            <div className="totals-row">
              <span>Sous-total :</span>
                <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="totals-row">
              <span>Livraison :</span>
                <span>Gratuite</span>
            </div>
            <div className="totals-row total">
              <span>Total :</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {showLoader && <LuxuryLoader />}
      <div className="breadcrumb">
        <Link href="/">Accueil</Link> / <Link href="/cart">Panier</Link> / <strong>Commande</strong>
      </div>

      <div className="checkout-progress">
        <div className={`progress-step ${currentStep >= STEPS.CART ? "active" : ""}`}>
          <span>1. Panier</span>
        </div>
        <div className={`progress-step ${currentStep >= STEPS.DELIVERY ? "active" : ""}`}>
          <span>2. Livraison</span>
        </div>
        <div className={`progress-step ${currentStep >= STEPS.BILLING ? "active" : ""}`}>
          <span>3. Facturation</span>
        </div>
        <div className={`progress-step ${currentStep >= STEPS.PAYMENT ? "active" : ""}`}>
          <span>4. Paiement</span>
        </div>
        <div className={`progress-step ${currentStep >= STEPS.CONFIRMATION ? "active" : ""}`}>
          <span>5. Confirmation</span>
        </div>
      </div>

      <div className="checkout-grid">
        <div className="checkout-main">
          {currentStep === STEPS.CART && renderCartStep()}
          {currentStep === STEPS.DELIVERY && renderDeliveryStep()}
          {currentStep === STEPS.BILLING && renderBillingStep()}
          {currentStep === STEPS.PAYMENT && renderPaymentStep()}
          {currentStep === STEPS.CONFIRMATION && renderConfirmationStep()}

          <div className="checkout-actions">
            {currentStep > STEPS.CART && (
              <button className="btn btn-plain" onClick={prevStep}>
                Précédent
              </button>
            )}
            {currentStep < STEPS.CONFIRMATION ? (
              <Golden className="btn-primary" onClick={nextStep}>
                Suivant
              </Golden>
            ) : (
              <Golden className="btn-primary" onClick={placeOrder} disabled={placing}>
                {placing ? "Traitement..." : "Confirmer la commande"}
            </Golden>
            )}
          </div>
        </div>

        <aside className="checkout-sidebar">
          <div className="cart-summary">
            <h3>Résumé</h3>
            <div className="cart-items-mini">
              {cartItems.map((item) => (
                <div key={item.cart_item_id} className="cart-row-mini">
                  <Image src={item.image || "/images/lux.png"} alt={item.product_name} width={40} height={40} />
                  <div className="cart-info-mini">
                    <div>{item.product_name}</div>
                    <div className="small">Qté: {item.quantity}</div>
                  </div>
                  <div>€{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="totals">
              <div className="totals-row">
                <span>Sous-total :</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="totals-row">
                <span>Livraison :</span>
                <span>Gratuite</span>
              </div>
              <div className="totals-row total">
                <span>Total :</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
