import React from "react";
import { IconButton, Typography, Grid } from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import useMySWR from "@/app/(DashboardLayout)/components/hooks/useMySWR";
import TokenIcon from '@mui/icons-material/Token';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

export interface MarketGlobalIf {
  active_cryptocurrencies: number,
  upcoming_icos: number,
  ongoing_icos: number,
  ended_icos: number,
  markets: number
  total_market_cap: {
    usd: number,
  },
  total_volume: {
    usd: number,
  },
  market_cap_percentage: {
    btc: number,
    eth: number
  },
  market_cap_change_percentage_24h_usd: number
}

export interface DefiGlobalIf {
  defi_market_cap: string,
  eth_market_cap: string,
  defi_to_eth_ratio: string,
  trading_volume_24h: string,
  defi_dominance: string
  top_coin_name: string,
  top_coin_defi_dominance: string
}

const abbreviateNumber = (value:number): string => {
  const suffixes = ['', 'K', 'M', 'B', 'T'];

  const formatNumber = (num:number, precision = 1) => {
    const index = Math.floor(Math.log10(num) / 3);
    const scaled = num / Math.pow(10, index * 3);
    return scaled.toFixed(precision) + suffixes[index];
  };

  const formattedValue = formatNumber(value);

  return formattedValue
};


const MarketSummary = () => {
  const { data: response } = useMySWR<{ data?: MarketGlobalIf }>(
    ['https://api.coingecko.com/api/v3/global'],
    "get",
  );

  const { data: responseDeFi } = useMySWR<{ data?: DefiGlobalIf }>(
    ['https://api.coingecko.com/api/v3/global/decentralized_finance_defi'],
    "get",
  );

  const market = [
    {
      logo: <TokenIcon sx={{ color: '#FA896B', fontSize:40 }}/>,
      name: 'Coins',
      value: response?.data ? Math.round(response.data.active_cryptocurrencies) : 0,
    },
    {
      logo: <AccountBalanceIcon sx={{ color: '#FA896B', fontSize:40 }}/>,
      name: 'Market Cap',
      value: response?.data ? '$' + abbreviateNumber(response.data.total_market_cap.usd) : 0,
    },
    {
      logo: <ShoppingCartIcon sx={{ color: '#FA896B', fontSize:40 }}/>,
      name: '24h Volume',
      value: response?.data ? '$' + abbreviateNumber(response.data.total_volume.usd) : 0,
    },
    {
      logo: <AttachMoneyIcon sx={{ color: '#FA896B', fontSize:40 }}/>,
      name: 'DeFi TVL',
      value: responseDeFi?.data ? '$' + abbreviateNumber(Number(responseDeFi.data.defi_market_cap)) : 0,
    },
    {
      logo: <CurrencyExchangeIcon sx={{ color: '#FA896B', fontSize:40 }}/>,
      name: '24h Trading',
      value: responseDeFi?.data ? '$' + abbreviateNumber(Number(responseDeFi.data.trading_volume_24h)) : 0,
    },
    {
      logo: <CurrencyBitcoinIcon sx={{ color: '#FA896B', fontSize:40 }}/>,
      name: 'BTC Dominance',
      value: response?.data ? abbreviateNumber(response.data.market_cap_percentage.btc) + '%' : 0,
    },
  ]

  return (
    <>
    {market.map((item, index) => (
      <Grid item xs={12} lg={2}>
        <DashboardCard key={index}>
          <div style={{ textAlign: 'center' }}>
            <IconButton>
            {item.logo}
            </IconButton> 
            <Typography variant="subtitle2" fontWeight={600}>{item.name}</Typography>
            <Typography variant="subtitle2" fontWeight={600}>{item.value}</Typography>
          </div>
        </DashboardCard>
      </Grid>
      ))}
    </>
  );
};

export default MarketSummary;
