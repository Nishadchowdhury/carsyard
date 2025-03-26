import { BodyType, Color, CurrencyCode, FuelType, OdoUnit, Transmission, ULEZCompliance } from "@prisma/client";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface FormatePriceArgs {
  price: number | null;
  currency: CurrencyCode | null;
}

export function formatUlezCompliance(ulezCompliance: ULEZCompliance) {
  return ulezCompliance === ULEZCompliance.EXEMPT ? "Exempt" : "Non-Exempt";
}

export function formatBodyType(bodyType: BodyType) {
  switch (bodyType) {
    case BodyType.CONVERTIBLE:
      return "Convertible";
    case BodyType.COUPE:
      return "Coupe";
    case BodyType.HATCHBACK:
      return "Hatchback";
    case BodyType.SUV:
      return "SUV";
    case BodyType.WAGON:
      return "Wagon";
    case BodyType.SEDAN:
      return "Sedan";
    default:
      return "Unknown";
  }
}



export function formatPrice({ price, currency }: FormatePriceArgs) {
  // 👉 It formats a price into a currency string in an internationally formatted way.
  if (!price) return "0"; // Handling Missing price

  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency", // Formats the number as currency.
    currencyDisplay: "narrowSymbol", // Uses a shorter currency symbol (e.g., $ instead of US$).
    ...(currency && { currency }),// Only add "currency" if it's provided
    maximumFractionDigits: 0 // Removes decimal places.
  }) // this the formatter function to format the number as a readable text.

  return formatter.format(price / 100)
}


export function formatNumber(num: number | null, options?: Intl.NumberFormatOptions) { // Format number to 2 decimal places 
  // Intl is used to format numbers to a specific locale
  // Intl.NumberFormatOptions is used to format the number to a specific locale
  // en-US is the locale
  if (num === null) return 0;
  return new Intl.NumberFormat("en-US", options).format(num);
}




export function formatOdometerUnit(unit: OdoUnit) {
  return unit === OdoUnit.MILES ? "mi" : "km";
}

export function formatTransmission(transmission: Transmission) {
  return transmission === Transmission.AUTOMATIC ? "Automatic" : "Manual";
}

export function formatFuelType(fuelType: FuelType) {

  switch (fuelType) {
    case FuelType.PETROL:
      return "Petrol";
    case FuelType.DIESEL:
      return "Diesel";
    case FuelType.ELECTRIC:
      return "Electric";
    case FuelType.HYBRID:
      return "Hybrid";
    default:
      return "Unknown";
  }

}

export function formatColor(color: Color) {
  switch (color) {
    case Color.BLACK:
      return "Black";
    case Color.BLUE:
      return "Blue";
    case Color.BROWN:
      return "Brown";
    case Color.GOLD:
      return "Gold";
    case Color.GREEN:
      return "Green";
    case Color.GREY:
      return "Grey";
    case Color.ORANGE:
      return "Orange";
    case Color.PINK:
      return "Pink";
    case Color.PURPLE:
      return "Purple";
    case Color.RED:
      return "Red";
    case Color.SILVER:
      return "Silver";
    case Color.WHITE:
      return "White";
    case Color.YELLOW:
      return "Yellow";
    default:
      return "Unknown";
  }

}