import React, { useState, createContext } from 'react'

export const ServiceTypeContext = createContext(undefined)

export const ServiceTypeProvider = ({ children }) => {
  const [serviceType, setServiceType] = useState('')

  return (
    <ServiceTypeContext.Provider value={[serviceType, setServiceType]}>
      {children}
    </ServiceTypeContext.Provider>
  )
}
