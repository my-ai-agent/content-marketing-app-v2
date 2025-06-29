"use client"

import { useState, useRef } from 'react'

export interface Demographic {
  value: string
  label: string
  description: string
}

interface Props {
  demographics: Demographic[]
  selectedDemographic: string
  setSelectedDemographic: (val: string) => void
}

export default function DemographicDropdown({
  demographics,
  selectedDemographic,
  setSelectedDemographic,
}: Props) {
  // ... (rest of your component code)
  // (copy all logic from your previous file here)
}
