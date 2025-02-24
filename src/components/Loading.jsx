import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center justify-center  text-black mb-2">
                {/* Spinner */}
                <motion.div
                    className="w-16 h-16 border-4 border-gray-800 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                ></motion.div>

                {/* Animated Text */}
                <motion.p
                    className="mt-4 text-lg font-semibold"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    Loading...
                </motion.p>
            </div>
        </div>
    );
}
