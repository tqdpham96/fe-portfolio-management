import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination
} from "@mui/material";
import Link from "next/link";
import React, { useMemo } from "react";
import Image from "mui-image";
import DashboardCard from "@/app/(DashboardLayout)//components/shared/DashboardCard";
import TableContainer from "@mui/material/TableContainer";
import useMySWR from "@/app/(DashboardLayout)/components/hooks/useMySWR";

export interface TableTokenHoldingIF {
  thumbnail: string,
  tokenSymbol: string,
  balance: number,
  balanceUsd: number,
  tokenPrice: number,
  contractAddress?: string,
}

function roundToTwoSignificantDigits(value: number): number {
  if (value === 0) {
    return 0;
  }

  if (value < 1) {
    const exponent = Math.floor(Math.log10(Math.abs(value))) + 1;
    const magnitude = Math.pow(10, 2 - exponent);

    const rounded = Math.round(value * magnitude) / magnitude;
    return rounded;
  } else {
    return Math.round(value * 100) / 100
  }
}

const TokenHolding = () => {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { data: response } = useMySWR<{ data?: TableTokenHoldingIF[] }>(
    ["https://api-asset-management-tqdpham.cyclic.app/api/v1/portfolio/token-holding"],
    "get",
  );

  const tokens: TableTokenHoldingIF[] = useMemo(() => (response?.data ? response.data : []), [response]);


  return (
    <DashboardCard title="Token Holding">
      <Box sx={{ overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table" }}>
          <TableContainer>
            <Table
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Id
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Token
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Balance
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Value
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle2" fontWeight={600}>
                      Price
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokens
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((token, index) => (
                    <TableRow key={token.tokenSymbol}>
                      <TableCell>
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                          }}
                        >
                          {index}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Image src={token.thumbnail} width={40} />
                          <Typography component={Link} target="_blank" href={token.contractAddress ? 
                          'https://etherscan.io/token/' + token.contractAddress : '/'
                          } rel="noopener noreferrer"
                            sx={{
                              fontSize: "15px",
                              fontWeight: "500",
                              marginLeft: "9px", // Adjust the margin as needed
                            }}
                          >
                            {token.tokenSymbol}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="h6">{Math.round(token.balance * 100) / 100}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="h6">${Math.round(token.balanceUsd * 100) / 100}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="h6">${roundToTwoSignificantDigits(token.tokenPrice)}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tokens.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default TokenHolding;
