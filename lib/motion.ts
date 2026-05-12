"use client"

import { gsap } from "gsap"
import { useRef, useEffect, useCallback, useLayoutEffect } from "react"

export function animateStepIn(
  element: HTMLElement | null,
  direction: "forward" | "backward" = "forward"
) {
  if (!element) return
  const x = direction === "forward" ? 24 : -24
  gsap.set(element, { opacity: 0, x, scale: 0.98 })
  gsap.to(element, {
    opacity: 1,
    x: 0,
    scale: 1,
    duration: 0.4,
    ease: "power3.out",
    clearProps: "x,scale",
    overwrite: "auto",
  })
}

export function animateSelect(element: HTMLElement | null) {
  if (!element) return
  gsap.fromTo(
    element,
    { scale: 0.92 },
    { scale: 1, duration: 0.35, ease: "back.out(1.7)", overwrite: "auto" }
  )
}

export function animatePress(element: HTMLElement | null) {
  if (!element) return
  gsap
    .timeline({ overwrite: "auto" })
    .to(element, { scale: 0.95, duration: 0.08, ease: "power2.in" })
    .to(element, { scale: 1, duration: 0.25, ease: "back.out(2)" })
}

export function animateChip(element: HTMLElement | null) {
  if (!element) return
  gsap.fromTo(
    element,
    { scale: 0.85 },
    { scale: 1, duration: 0.3, ease: "back.out(2.5)", overwrite: "auto" }
  )
}

export function animateCheckmark(element: HTMLElement | null) {
  if (!element) return
  gsap
    .timeline({ overwrite: "auto" })
    .fromTo(element, { scale: 0, rotation: -45 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2)" })
}

export function animateStagger(
  elements: (HTMLElement | null)[],
  stagger = 0.04
) {
  const valid = elements.filter(Boolean) as HTMLElement[]
  if (valid.length === 0) return
  gsap.fromTo(
    valid,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.35, stagger, ease: "power2.out", overwrite: "auto" }
  )
}

export function animateProgress(element: HTMLElement | null) {
  if (!element) return
  gsap.to(element, {
    scaleX: 1,
    duration: 0.6,
    ease: "power3.out",
    transformOrigin: "left center",
    overwrite: "auto",
  })
}

export function animateReveal(element: HTMLElement | null) {
  if (!element) return
  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" }
  )
}

export function animateRevealStagger(elements: (HTMLElement | null)[], stagger = 0.06) {
  const valid = elements.filter(Boolean) as HTMLElement[]
  if (valid.length === 0) return
  gsap.fromTo(
    valid,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.4, stagger, ease: "power2.out", overwrite: "auto" }
  )
}

export function useStepTransition(step: number) {
  const ref = useRef<HTMLDivElement>(null)
  const prevStep = useRef(step)
  const isInitial = useRef(true)

  useLayoutEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      if (ref.current) {
        gsap.fromTo(ref.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "y" }
        )
      }
      return
    }

    if (prevStep.current !== step && ref.current) {
      const direction = step > prevStep.current ? "forward" : "backward"
      const x = direction === "forward" ? 20 : -20
      gsap.set(ref.current, { opacity: 0, x })
      gsap.to(ref.current, {
        opacity: 1,
        x: 0,
        duration: 0.35,
        ease: "power3.out",
        clearProps: "x",
        overwrite: "auto",
      })
      prevStep.current = step
    }
  }, [step])

  return ref
}

export function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
  }, [])

  return ref
}
