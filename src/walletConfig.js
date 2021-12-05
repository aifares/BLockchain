import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ABIFILE from "./ABIFILE.json";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
const SimpleStorage = () => {
  // deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
  let contractAddress = "0x2811d139974AB83f53125aAdC395b6102689792b";

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [billTotal, setBIllTotal] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(
      contractAddress,
      ABIFILE,
      tempSigner
    );
    setContract(tempContract);
  };

  const setReservation = (event) => {
    event.preventDefault();
    contract.reserve(
      event.target.setPartySize.value,
      event.target.setTime.value
    );
  };

  const setCheckIn = (event) => {
    event.preventDefault();
    contract.Checkin();
  };

  const pay = (event) => {
    event.preventDefault();
    contract.transfer("0xe0119d0B935236593b54055b2c0F49D4C67215b5",1);
  };

  const addToBill = (event) => {
    event.preventDefault();
    contract.addToBill(event.target.amount.value);
  };

  const seeBill = async () => {
    console.log("SeeBill");
    let val = await contract.SeeMyBill();
    let decimal = parseInt(val, 16);
    setBIllTotal(decimal);
  };

  return (
    <div>
      <h4> {"Get/Set Contract interaction"} </h4>
      <button onClick={connectWalletHandler}>{connButtonText}</button>
      <div>
        <h3>Address: {defaultAccount}</h3>
      </div>
      <form onSubmit={setReservation}>
        <TextField
          variant="outlined"
          id="setPartySize"
          type="text"
          placeholder="Party Size"
        />
        <TextField
          id="setTime"
          variant="outlined"
          type="text"
          placeholder="Reservavtion Time"
        />
        <Button variant="contained" type={"submit"}>
          {" "}
          Make Reservavtion{" "}
        </Button>
      </form>
      <form onSubmit={addToBill}>
        <TextField
          variant="outlined"
          id="amount"
          type="text"
          placeholder="Amount To Add"
        />
        <div>
          <Button variant="contained" type={"submit"}>
            {" "}
            Add To Bill{" "}
          </Button>
        </div>
      </form>

      <div>
        <Button onClick={setCheckIn} variant="contained">
          Check In
        </Button>
      </div>

      <div>
        <Button onClick={seeBill} variant="contained">
          See My Bill
        </Button>
      </div>
      <div>
        <Button onClick={pay} variant="contained">
          Pay Bill
        </Button>
      </div>

      {errorMessage}
      {billTotal}
    </div>
  );
};

export default SimpleStorage;
