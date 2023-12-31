'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import BalanceChart from '@/app/(DashboardLayout)/components/dashboard/BalanceChart';
import BalanceDistribution from '@/app/(DashboardLayout)/components/dashboard/BalanceDistribution';
import TokenTransfers from '@/app/(DashboardLayout)/components/dashboard/TokenTransfers';
import TokenHolding from '@/app/(DashboardLayout)/components/dashboard/TokenHolding';
import NFT from '@/app/(DashboardLayout)/components/dashboard/NFT';
import TransactionCount from '@/app/(DashboardLayout)/components/dashboard/TransactionCount';
import MarketSummary from '@/app/(DashboardLayout)/components/dashboard/MarketSummary';
import useMySWR from "@/app/(DashboardLayout)/components/hooks/useMySWR";

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <MarketSummary />
          <Grid item xs={12} lg={8}>
            <BalanceChart />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <BalanceDistribution />
              </Grid>
              <Grid item xs={12}>
                <TransactionCount />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <TokenTransfers />
          </Grid>
          <Grid item xs={12} lg={8}>
            <TokenHolding />
          </Grid>
          <Grid item xs={12}>
            <NFT />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
