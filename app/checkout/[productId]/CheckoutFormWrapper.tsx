"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutFormWrapper({ productId, price }: { productId: string, price: number }) {
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("/api/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setClientSecret(data.clientSecret);
                }
            })
            .catch((err) => {
                console.error("Error fetching payment intent:", err);
                setError("Failed to initialize payment. Please refresh the page.");
            });
    }, [productId]);

    const appearance = {
        theme: 'flat' as const,
        variables: {
            colorPrimary: '#03192e',
            colorBackground: '#ffffff',
            colorText: '#1b1c19',
            colorDanger: '#df1b41',
            fontFamily: 'Manrope, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px',
        },
        rules: {
            '.Input': {
                border: '1px solid #e4e2e1',
                boxShadow: 'none',
            },
            '.Input:focus': {
                border: '1px solid #03192e',
                boxShadow: 'none',
            },
            '.Label': {
                fontWeight: '500',
                color: '#656464',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            }
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <p className="text-red-800 font-label uppercase tracking-wider text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-secondary text-xs">Try Again</button>
            </div>
        );
    }

    const elementOptions: any = {
        clientSecret,
        appearance,
        developerTools: {
            assistant: {
                enabled: false
            }
        }
    };

    return (
        <div className="w-full">
            {clientSecret ? (
                <Elements
                    options={elementOptions}
                    stripe={stripePromise}
                >
                    <CheckoutForm amount={price} productId={productId} />
                </Elements>
            ) : (
                <div className="flex justify-center items-center py-24">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
