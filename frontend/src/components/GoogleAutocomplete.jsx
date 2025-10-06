import React, { useEffect, useRef } from "react";

const GoogleAutocomplete = ({ setAddress, setCounty, ...props }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      componentRestrictions: { country: "uk" },
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.formatted_address) {
        return;
      }

      const address = place.formatted_address;
      const components = place.address_components || [];

      const countyComponent = components.find((c) =>
        c.types.includes("administrative_area_level_2")
      );

      const county = countyComponent?.long_name || "";

    

      setAddress(address);
      setCounty(county);
    });
  }, [setAddress, setCounty]);

  return <input
    type="text"
    ref={inputRef}
    placeholder="Enter venue..."
    className="border rounded p-2 w-full"
    {...props}
  />;
};

export default GoogleAutocomplete;