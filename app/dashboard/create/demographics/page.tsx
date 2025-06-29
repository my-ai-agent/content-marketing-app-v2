"use client"

import { useState } from "react"
import DemographicDropdown, { Demographic } from "./DemographicDropdown"

const DEMOGRAPHICS: Demographic[] = [
  {
    value: "student",
    label: "Student",
    description: "Learners in high school, college, or university programs."
  },
  {
    value: "marketer",
    label: "Marketer",
    description: "Professionals working in marketing roles or teams."
  },
  {
    value: "founder",
    label: "Founder",
    description: "Startup founders, entrepreneurs, or business owners."
  },
  {
    value: "freelancer",
    label: "Freelancer",
    description: "Independent contractors or gig economy workers."
  }
  // Add more demographics as needed
]

export default function Page() {
  const [selectedDemographic, setSelectedDemographic] = useState("")

  return (
    <main style={{ maxWidth: 600, margin: "3rem auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        Pick a Demographic
      </h1>
      <DemographicDropdown
        demographics={DEMOGRAPHICS}
        selectedDemographic={selectedDemographic}
        setSelectedDemographic={setSelectedDemographic}
      />
      {selectedDemographic && (
        <div style={{ marginTop: "2rem", fontSize: "1.1rem" }}>
          You selected:{" "}
          <strong>
            {
              DEMOGRAPHICS.find((d) => d.value === selectedDemographic)?.label
            }
          </strong>
        </div>
      )}
    </main>
  )
}
