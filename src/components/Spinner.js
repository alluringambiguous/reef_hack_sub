import React from "react";
import Uik from '@reef-defi/ui-kit'
import "./Spinner.css"

export default function LoadingSpinner({setIsLoading, isLoading}) {
  return (
    <div className="spinnerContainer">
      <Uik.Loading text={isLoading} >
      </Uik.Loading>
    </div>
  );
}