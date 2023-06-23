import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import BasicDutchAuctionArtifact from '../artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json';
import { Provider } from '../utils/provider';
import { SectionDivider } from './SectionDivider';

const StyledDeployContractButton = styled.button`
  width: 180px;
  heigh---------------------------t: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export default function DutchAuction(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [auctionContract, setAuctionContract] = useState<Contract>();
  const [auctionContractAddr, setAuctionContractAddr] = useState<string>('');
  const [reservePrice, setReservePrice] = useState<string>('');
  const [numBlocksAuctionOpen, setNumBlocksAuctionOpen] = useState<string>('');
  const [offerPriceDecrement, setOfferPriceDecrement] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [winner, setWinner] = useState<string>('');
  const [bidAmount, setBidAmount] = useState<string>("");

  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect(() => {
    if (!auctionContract) {
      return;
    }

    async function getAuctionInfo(auctionContract: Contract): Promise<void> {
      const _reservePrice = await auctionContract.reservePrice();
      const _numBlocksAuctionOpen = await auctionContract.numBlocksAuctionOpen();
      const _offerPriceDecrement = await auctionContract.offerPriceDecrement();
      const _currentPrice = await auctionContract.getCurrentPrice();
      const _winner = await auctionContract.winner();

      setReservePrice(_reservePrice.toString());
      setNumBlocksAuctionOpen(_numBlocksAuctionOpen.toString());
      setOfferPriceDecrement(_offerPriceDecrement.toString());
      setCurrentPrice(_currentPrice.toString());
      setWinner(_winner);
    }

    getAuctionInfo(auctionContract);
  }, [auctionContract]);

 async function deployAuctionContract(): Promise<void> {
  if (auctionContract || !signer) {
    return;
  }

  async function deployGreeterContract(signer: Signer): Promise<void> {
    const Auction = new ethers.ContractFactory(
      BasicDutchAuctionArtifact.abi,
      BasicDutchAuctionArtifact.bytecode,
      signer
    );

    try {
      const auctionContract = await Auction.deploy(reservePrice, parseInt(numBlocksAuctionOpen), offerPriceDecrement);

      await auctionContract.deployed();

      const greeting = await auctionContract.getCurrentPrice();

      setAuctionContract(auctionContract);
      // setGreeting(greeting);

      window.alert(`Auction deployed to: ${auctionContract.address}`);

      setAuctionContractAddr(auctionContract.address);
    } catch (error: any) {
      window.alert(
        'Error!' + (error && error.message ? `\n\n${error.message}` : '')
      );
    }
  }

  deployGreeterContract(signer);
}

  
  async function showAuctionInfo(): Promise<void> {
    if (!auctionContractAddr || !signer) {
      window.alert('Please provide a valid auction contract address');
      return;
    }

    try {
      const auctionContract = new ethers.Contract(
        auctionContractAddr,
        BasicDutchAuctionArtifact.abi,
        signer
      );

      const _reservePrice = await auctionContract.reservePrice();
      const _numBlocksAuctionOpen = await auctionContract.numBlocksAuctionOpen();
      const _offerPriceDecrement = await auctionContract.offerPriceDecrement();
      const _currentPrice = await auctionContract.getCurrentPrice();
      const _winner = await auctionContract.winner();

      setAuctionContract(auctionContract);
      setReservePrice(_reservePrice.toString());
      setNumBlocksAuctionOpen(_numBlocksAuctionOpen.toString());
      setOfferPriceDecrement(_offerPriceDecrement.toString());
      setCurrentPrice(_currentPrice.toString());
      setWinner(_winner);
    } catch (error: any) {
      window.alert(
        'Error!' + (error && error.message ? `\n\n${error.message}` : '')
      );
    }
  }

  function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    deployAuctionContract();
  }

  function handleShowInfo(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    showAuctionInfo();
  }

  function handleBid(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    const auctionContract = new ethers.Contract(
        auctionContractAddr,
        BasicDutchAuctionArtifact.abi,
        signer
    );
    setAuctionContract(auctionContract);
    console.log(auctionContract,signer, "safasf")

    if (!auctionContract) {
      window.alert('Undefined greeterContract');
      return;
    }

    if (!currentPrice) {
      window.alert('Greeting cannot be empty');
      return;
    }

    async function submitGreeting(greeterContract: Contract): Promise<void> {
      try {
        const setGreetingTxn = await greeterContract.bid({
          value: bidAmount
        });
        // const setGreetingTxn = await greeterContract.setGreeting("dsafdsg");

        await setGreetingTxn.wait();
        console.log()

        // const newGreeting = await greeterContract.greet();
        window.alert(`Success!\n\nGreeting is now: ${"Congratulations!!"}`);

        // if (newGreeting !== greeting) {
        //   setGreeting(newGreeting);
        // }
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    

    submitGreeting(auctionContract);
  }

  function handleReservePriceChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setReservePrice(event.target.value);
  }

  function handleNumBlocksAuctionOpenChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setNumBlocksAuctionOpen(event.target.value);
  }

  function handleOfferPriceDecrementChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setOfferPriceDecrement(event.target.value);
  }

  function handleBidAmountChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    setCurrentPrice(event.target.value);
  }

  return (
    <>
      <h1>Basic Dutch Auction</h1>
      <SectionDivider />
      <h2>Deployment</h2>
      <StyledGreetingDiv>
        <StyledLabel>Reserve Price:</StyledLabel>
        <StyledInput
          type="text"
          value={reservePrice}
          onChange={handleReservePriceChange}
        />
      </StyledGreetingDiv>
      <StyledGreetingDiv>
        <StyledLabel>Number of Blocks Auction Open:</StyledLabel>
        <StyledInput
          type="text"
          value={numBlocksAuctionOpen}
          onChange={handleNumBlocksAuctionOpenChange}
        />
      </StyledGreetingDiv>
      <StyledGreetingDiv>
        <StyledLabel>Offer Price Decrement:</StyledLabel>
        <StyledInput
          type="text"
          value={offerPriceDecrement}
          onChange={handleOfferPriceDecrementChange}
        />
      </StyledGreetingDiv>
      <StyledDeployContractButton onClick={handleDeployContract}>
        Deploy
      </StyledDeployContractButton>
      <SectionDivider />
      <h2>Look up info on an auction</h2>
      <StyledGreetingDiv>
        <StyledLabel>Auction Contract Address:</StyledLabel>
        <StyledInput
          type="text"
          value={auctionContractAddr}
          onChange={(event) => setAuctionContractAddr(event.target.value)}
        />
      </StyledGreetingDiv>
      <StyledButton onClick={handleShowInfo}>Show Info</StyledButton>
      <StyledGreetingDiv>
        <StyledLabel>Reserve Price:</StyledLabel>
        <StyledInput type="text" value={reservePrice} disabled />
      </StyledGreetingDiv>
      <StyledGreetingDiv>
        <StyledLabel>Number of Blocks Auction Open:</StyledLabel>
        <StyledInput type="text" value={numBlocksAuctionOpen} disabled />
      </StyledGreetingDiv>
      <StyledGreetingDiv>
        <StyledLabel>Offer Price Decrement:</StyledLabel>
        <StyledInput type="text" value={offerPriceDecrement} disabled />
      </StyledGreetingDiv>
      <StyledGreetingDiv>
        <StyledLabel>Current Price:</StyledLabel>
        <StyledInput type="text" value={currentPrice} disabled />
      </StyledGreetingDiv>
      <StyledGreetingDiv>
        <StyledLabel>Winner:</StyledLabel>
        <StyledInput type="text" value={winner} disabled />
      </StyledGreetingDiv>
      <SectionDivider />
      <h2>Submit a bid</h2>
      <StyledGreetingDiv>
        <StyledLabel>Auction Contract Address:</StyledLabel>
        <StyledInput
          type="text"
          value={auctionContractAddr}
          onChange={(event) => setAuctionContractAddr(event.target.value)}
        />
      </StyledGreetingDiv>
      <StyledGreetingDiv>
        <StyledLabel>Bid Amount:</StyledLabel>
        <StyledInput
          type="number"
          value={bidAmount}
          onChange={(event)=>setBidAmount(event.target.value)}
        />
      </StyledGreetingDiv>
      <StyledButton onClick={handleBid}>Bid</StyledButton>
    </>
  );
}
