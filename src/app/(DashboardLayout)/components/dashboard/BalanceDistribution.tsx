import React, { useMemo } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft, IconArrowDownRight } from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import useMySWR from "@/app/(DashboardLayout)/components/hooks/useMySWR";

export interface BalanceIF {
  balanceNow: number,
  balanceLastYear: number,
  nativeToken: number,
}

const BalanceDistribution = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const error = theme.palette.error.main;
  const successlight = theme.palette.success.light;
  const errorlight = '#fdede8';

  const { data: response } = useMySWR<{ data?: BalanceIF  }>(
    ["https://api-asset-management-tqdpham.cyclic.app/api/v1/portfolio/balance"],
    "get",
  );

  const totalBalance: number = useMemo(() => (response?.data ? response.data.balanceNow : 0), [response]);
  const nativeToken: number = useMemo(() => (response?.data ? response.data.nativeToken : 0), [response]);
  const balanceLastYear: number = useMemo(() => (response?.data ? response.data.balanceLastYear : 0), [response]);
  const percentChange = (totalBalance - balanceLastYear) * 100 / balanceLastYear;
  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 170,
    },
    colors: [error, primary],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart: number[] = [nativeToken, Number(totalBalance) - nativeToken];
  return (
    <DashboardCard title="Balance Distribution">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={6} sm={7}>
          <Typography variant="h3" fontWeight="700">
            ${Math.round(totalBalance * 100) / 100}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            mt={1}
            alignItems="center"
          >
            <Stack direction="row">
              {percentChange > 0 ? (
                <>
                  <Avatar sx={{ bgcolor: successlight, width: 21, height: 21 }}>
                    <IconArrowUpLeft width={18} color="#39B69A" />
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight="600">
                    {Math.round(percentChange * 100) / 100}%
                  </Typography>
                </>
              ) : (
                <>
                  <Avatar sx={{ bgcolor: errorlight, width: 21, height: 21 }}>
                    <IconArrowDownRight width={18} color="#FA896B" />
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight="600">
                    {Math.round(percentChange * 100) / 100}%
                  </Typography>
                </>
              )}
            </Stack>

            <Typography variant="subtitle2" color="textSecondary">
              last year
            </Typography>
          </Stack>
          <Stack spacing={3} mt={3} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primary,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography
                variant="subtitle2"
                fontSize="12px"
                color="textSecondary"
              >
                Native
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: error,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography
                variant="subtitle2"
                fontSize="12px"
                color="textSecondary"
              >
                ERC20
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid item xs={6} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            width={"100%"}
            height="150px"
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default BalanceDistribution;
