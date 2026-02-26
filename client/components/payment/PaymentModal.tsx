"use client";

import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface PaymentModalProps {
    orderId: string;
    amount: number;
    onSuccess: (paymentId: string) => void;
    onFailure: () => void;
    onClose: () => void;
}

export default function PaymentModal({
    orderId,
    amount,
    onSuccess,
    onFailure,
    onClose,
}: PaymentModalProps) {
    const [step, setStep] = useState<"SELECT" | "PROCESSING" | "SUCCESS" | "FAILED">("SELECT");
    const [paymentId, setPaymentId] = useState<string>("");

    const simulatePayment = async (status: "SUCCESS" | "FAILED") => {
        setStep("PROCESSING");

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const mockPaymentId = "pay_" + Math.random().toString(36).substring(7);
        setPaymentId(mockPaymentId);

        if (status === "SUCCESS") {
            setStep("SUCCESS");
            setTimeout(() => onSuccess(mockPaymentId), 1500);
        } else {
            setStep("FAILED");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full p-6 space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Payment</h2>
                    <p className="text-gray-500">Order ID: {orderId}</p>
                    <p className="text-3xl font-bold mt-2 text-indigo-600">₹{amount}</p>
                </div>

                {step === "SELECT" && (
                    <div className="space-y-3">
                        <p className="text-center text-sm text-gray-500">
                            This is a simulation. Choose an outcome:
                        </p>
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => simulatePayment("SUCCESS")}
                        >
                            Simulate Success
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => simulatePayment("FAILED")}
                        >
                            Simulate Failure
                        </Button>
                        <button
                            onClick={onClose}
                            className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {step === "PROCESSING" && (
                    <div className="flex flex-col items-center py-8 space-y-4">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                        <p className="font-medium">Processing your payment...</p>
                    </div>
                )}

                {step === "SUCCESS" && (
                    <div className="flex flex-col items-center py-8 space-y-4 animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                        <div className="text-center">
                            <p className="text-xl font-bold">Payment Successful!</p>
                            <p className="text-sm text-gray-500">Payment ID: {paymentId}</p>
                        </div>
                    </div>
                )}

                {step === "FAILED" && (
                    <div className="flex flex-col items-center py-8 space-y-4 animate-in zoom-in duration-300">
                        <XCircle className="w-16 h-16 text-red-500" />
                        <div className="text-center">
                            <p className="text-xl font-bold">Payment Failed</p>
                            <p className="text-sm text-gray-500">Something went wrong. Please try again.</p>
                        </div>
                        <div className="flex gap-2 w-full pt-4">
                            <Button
                                className="flex-1"
                                onClick={() => setStep("SELECT")}
                            >
                                Retry
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-1"
                                onClick={onFailure}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
