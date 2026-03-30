"use client";

import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    ExpressCheckoutElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

export default function CheckoutForm({ amount, productId }: { amount: number, productId: string }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success?product_id=${productId}`,
            },
        });

        if (error && (error.type === "card_error" || error.type === "validation_error")) {
            setMessage(error.message || "An error occurred");
        } else if (error) {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs" as const
    };

    const confirmExpressCheckout = async () => {
        if (!stripe || !elements) return;

        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret: new URLSearchParams(window.location.search).get(
                "payment_intent_client_secret"
            ) || undefined,
            confirmParams: {
                return_url: `${window.location.origin}/success?product_id=${productId}`,
            },
        });

        if (error) {
            setMessage(error.message || "An error occurred");
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="mb-6">
                <ExpressCheckoutElement
                    onConfirm={confirmExpressCheckout}
                    options={{
                        buttonType: {
                            applePay: 'buy',
                            googlePay: 'buy'
                        }
                    }}
                />
            </div>

            <div className="flex items-center gap-4 py-2">
                <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
                <span className="font-label text-[0.6rem] uppercase tracking-widest text-secondary">Or pay with card</span>
                <div className="h-[1px] flex-1 bg-outline-variant/30"></div>
            </div>

            <PaymentElement id="payment-element" options={paymentElementOptions} />

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="btn-primary w-full py-6 text-xs tracking-[0.2em] relative"
            >
                <span id="button-text">
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin mx-auto"></div>
                    ) : (
                        `Pay $${(amount / 100).toFixed(2)}`
                    )}
                </span>
            </button>

            {/* Show any error or success messages */}
            {message && (
                <div id="payment-message" className="text-secondary text-sm font-label uppercase tracking-widest text-center animate-fade-in mt-4">
                    {message}
                </div>
            )}
        </form>
    );
}
