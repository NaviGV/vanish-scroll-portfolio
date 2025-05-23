
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const sliderColor = props.style && '--slider-color' in props.style 
    ? String(props.style['--slider-color']) 
    : 'hsl(var(--primary))';
    
  // Determine if a gradient is being used
  const isGradient = sliderColor.includes('gradient');

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range 
          className={cn(
            "absolute h-full rounded-full", 
            isGradient && "animate-pulse-gentle"
          )}
          style={{ 
            background: sliderColor,
            backgroundSize: "200% auto",
            animation: isGradient ? "gradient-shift 5s linear infinite" : "none",
          }} 
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className={cn(
          "block h-3 w-3 rounded-full border ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-100",
          isGradient && "animate-pulse-gentle"
        )}
        style={{ 
          background: sliderColor,
          borderColor: "transparent",
          backgroundSize: isGradient ? "200% auto" : "auto",
          animation: isGradient ? "gradient-shift 5s linear infinite" : "none",
        }}
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
