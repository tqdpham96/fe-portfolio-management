
import React, {useMemo} from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowUpLeft, IconCurrencyDollar } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import useMySWR from "@/app/(DashboardLayout)/components/hooks/useMySWR";

export interface TransactionCountIF {
  txnCountNow: number,
  txnCountLastYear: number
}

const TransactionCount = () => {
  
  const { data: response } = useMySWR<{ data?: TransactionCountIF  }>(
    ["https://api-asset-management-tqdpham.cyclic.app/api/v1/portfolio/transaction"],
    "get",
  );

  const txnCount: number = useMemo(() => (response?.data ? response.data.txnCountNow: 0), [response]);
  const txnCountLastYear: number = useMemo(() => (response?.data ? response.data.txnCountLastYear : 0), [response]);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const successlight = theme.palette.success.light;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [primary],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart: any = [
    {
      name: '',
      color: primary,
      data: [25, 66, 20, 40, 12, 58, 20],
    },
  ];

  return (
    <DashboardCard
      title="Transaction Count"
      action={
        <Fab color="error" size="medium" sx={{color: '#ffffff'}}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" width={"100%"} height="60px" />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {txnCount}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ bgcolor: successlight, width: 21, height: 21 }}>
            <IconArrowUpLeft width={18} color="#39B69A" />
          </Avatar>
          <Typography variant="subtitle2" fontWeight="600">
            +{txnCount && Number(txnCountLastYear) >= 0 ? txnCount-Number(txnCountLastYear) : 0}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            last year
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default TransactionCount;
