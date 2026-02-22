'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { motion } from "framer-motion";

export function SplineHero() {
    return (
        <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden border-white/10 shadow-2xl gold-glow">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            <div className="h-full relative z-10">
                <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                />
            </div>

            {/* Subtle Overlay to make it feel more premium */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
        </Card>
    )
}
