export const timeCostByUse = 30 // Base of time cost
export const maxSpeedTier = 10 // Max amount of acelerations

// Last slot with a Temporal Bottle
export const cachePlayerBottleSlot = new Map<string, number>() // Player Id > Slot Index

// Fuel stored in a furnace
export const furnaceFuelStoredAmount = new Map<number, number>() // Pos BitShift > Fuel Amount