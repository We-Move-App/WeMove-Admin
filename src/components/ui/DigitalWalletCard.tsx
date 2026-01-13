import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface DigitalWalletCardProps {
    balance: number;
    cardNumber: string;
    currency?: string;
    expiry: string;
    cardTitle?: string;
}

export default function DigitalWalletCard({
    balance,
    cardNumber,
    currency = "₹",
    cardTitle = "Digital Debit Card",
}: DigitalWalletCardProps) {
    const [showNumber, setShowNumber] = useState(false);
    // 1. Mask raw number first
    const maskedRawCardNumber = cardNumber
        ? cardNumber.replace(/\d(?=\d{4})/g, "*")
        : "****************";

    // 2. Format masked number into 4-digit groups
    const maskedCardNumber = maskedRawCardNumber
        .replace(/(.{4})/g, "$1 ")
        .trim();

    // 3. Format full number for show mode
    const formattedCardNumber = cardNumber
        ? cardNumber.replace(/(.{4})/g, "$1 ").trim()
        : "";


    return (
        <div className="relative w-full h-56 rounded-2xl bg-[#3f735f] text-white p-6 overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#fdbb63] rounded-full translate-x-1/3 -translate-y-1/3" />

            <div className="relative z-10 flex justify-between items-center">
                <h3 className="text-lg font-semibold">{cardTitle}</h3>
            </div>

            <div className="relative z-10 mt-6 flex items-center gap-3">
                <span className="tracking-widest text-lg">
                    {showNumber ? formattedCardNumber : maskedCardNumber}
                </span>


                <button
                    onClick={() => setShowNumber(!showNumber)}
                    className="text-white/80 hover:text-white"
                >
                    {showNumber ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <div className="relative z-10 mt-8">
                <p className="text-4xl font-bold">
                    {currency}
                    {balance.toLocaleString()}
                </p>
            </div>
        </div>
    );
}

