import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!formData.email) {
      setError("L'email est requis");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Format d'email invalide");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("🔄 Envoi demande de réinitialisation pour:", formData.email);

      const response = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi");
      }

      // Succès
      setSuccess(`Email de réinitialisation envoyé à ${formData.email}`);
      setEmailSent(true);
      
      console.log("✅ Email envoyé avec succès:", data);

      // Optionnel : Redirection après 5 secondes
      setTimeout(() => {
        history.push("/auth/login");
      }, 5000);

    } catch (error) {
      console.error("❌ Erreur forgot password:", error);
      setError(error.message || "Erreur lors de l'envoi de l'email");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!emailSent) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du renvoi");
      }

      setSuccess("Email renvoyé avec succès !");
      
    } catch (error) {
      setError(error.message || "Erreur lors du renvoi de l'email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              
              {/* Header */}
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-700 text-xl font-bold">
                    Mot de passe oublié
                  </h6>
                  <p className="text-blueGray-500 text-sm mt-2">
                    {!emailSent 
                      ? "Entrez votre email pour recevoir un lien de réinitialisation" 
                      : "Vérifiez votre boîte email"
                    }
                  </p>
                </div>
              </div>

              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                
                {/* Messages d'erreur et de succès */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      {success}
                    </div>
                  </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="email"
                    >
                      Adresse email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Entrez votre adresse email"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className={`bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Envoi en cours...
                        </div>
                      ) : (
                        "Envoyer le lien"
                      )}
                    </button>
                  </div>
                </form>

                {/* Actions supplémentaires */}
                {emailSent && (
                  <div className="text-center mt-4">
                    <button
                      onClick={handleResendEmail}
                      className="text-blueGray-600 hover:text-blueGray-800 text-sm underline"
                      disabled={loading}
                    >
                      Renvoyer l'email
                    </button>
                  </div>
                )}

                {/* Informations supplémentaires */}
                {emailSent && (
                  <div className="bg-blueGray-100 border-l-4 border-blueGray-500 p-4 mt-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blueGray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blueGray-600">
                          <strong>Important :</strong> Le lien expire dans 10 minutes. 
                          Vérifiez aussi vos spams si vous ne voyez pas l'email.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Liens de navigation */}
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/2">
                <Link 
                  to="/auth/login"
                  className="text-blueGray-200 hover:text-blueGray-300 transition-colors duration-150"
                >
                  <small>← Retour à la connexion</small>
                </Link>
              </div>
              <div className="w-1/2 text-right">
                <Link 
                  to="/auth/register" 
                  className="text-blueGray-200 hover:text-blueGray-300 transition-colors duration-150"
                >
                  <small>Créer un compte</small>
                </Link>
              </div>
            </div>

            {/* Message de redirection automatique */}
            {success && (
              <div className="text-center mt-4">
                <p className="text-blueGray-400 text-xs">
                  Redirection automatique vers la page de connexion dans 5 secondes...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}