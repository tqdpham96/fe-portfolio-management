import React, {useMemo} from "react";
import { MenuItem, Box, IconButton, Menu } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useMySWR from "@/app/(DashboardLayout)/components/hooks/useMySWR";

export interface HistoryIF {
  dates: string[],
  balances: number[]
}

const options = [
  "Action",
  "Another Action",
  "Something else here",
];

const BalanceChart = () => {
  // menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: response } = useMySWR<{ data?: HistoryIF }>(
    ["https://api-asset-management-tqdpham.cyclic.app/api/v1/portfolio/history"],
    "get",
  );

  const PnL: number[] = useMemo(() => (response?.data?.balances ? response.data.balances.reverse().map((value, index, array) => index === 0 ? 0 : value - array[index - 1]) : []), [response]);

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.error.main;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },

    stroke: {
      show: true,
      width: 5,
      lineCap: "butt",
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: [
    {
      tickAmount: 4,
      decimalsInFloat: 0,
      forceNiceScale: true,
    },
    {
      tickAmount: 4,
      decimalsInFloat: 0,
      forceNiceScale: true,
      opposite: true,
    }
  ],
    xaxis: {
      categories: response?.data?.dates,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
    },
  };
  const seriescolumnchart: any = [
    {
      name: "Balance",
      data: response?.data?.balances ? response.data.balances : [],
    },
    {
      name: "PnL",
      data: PnL,
    }
  ];

  return (
    <DashboardCard
      title="Balance & Daily PnL"
      action={
        <>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            {options.map((option) => (
              <MenuItem
                key={option}
                selected={option === "Pyxis"}
                onClick={handleClose}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </>
      }
    >
      <Box className="rounded-bars">
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="bar"
          width={"100%"}
          height="370px"
        />
      </Box>
    </DashboardCard>
  );
};

export default BalanceChart;
