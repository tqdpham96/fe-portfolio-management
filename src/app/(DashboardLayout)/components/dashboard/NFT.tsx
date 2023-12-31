
import Link from "next/link";
import {
  CardContent,
  Typography,
  Grid,
  Rating,
  Tooltip,
  Fab,
} from "@mui/material";
import { Stack } from "@mui/system";
import { IconBasket } from "@tabler/icons-react";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";
import DashboardCard from "@/app/(DashboardLayout)//components/shared/DashboardCard";
import useMySWR from "@/app/(DashboardLayout)/components/hooks/useMySWR";
import {useMemo} from "react";
import Image from "mui-image";

export interface NFTResultIF {
  blockchain: string,
  name: string,
  tokenId: string,
  tokenUrl: string,
  imageUrl: string,
  collectionName: string,
  symbol: string,
  contractType: string,
  contractAddress: string,
  quantity: string
}


const NFT = () => {

  const { data: response } = useMySWR<{ data?: NFTResultIF[]  }>(
    ["https://api-asset-management-tqdpham.cyclic.app/api/v1/portfolio/nft-holding"],
    "get",
  );

  const nfts: NFTResultIF[] = useMemo(() => (response?.data ? response.data.filter(e=>e.imageUrl && e.tokenUrl) : []), [response]);


  return (
    <DashboardCard title="NFT Holding">
    <Grid container spacing={3}>
      {nfts.map((product, index) => (
        <Grid item xs={12} md={4} lg={3} key={index}>
          <BlankCard>
            <Typography component={Link} target="_blank" href={product.tokenUrl} rel="noopener noreferrer">
              <Image
                src={product.imageUrl}
                width={250}
                height={240}
              />
            </Typography>
            <Tooltip title="Add To Cart">
              <Fab
                size="small"
                color="primary"
                sx={{ bottom: "75px", right: "15px", position: "absolute" }}
              >
                <IconBasket size="16" />
              </Fab>
            </Tooltip>
            <CardContent sx={{ p: 3, pt: 2 }}>
              <Typography 
              variant="h6"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%', // Ensure the text doesn't overflow the container
              }}
              >{product.collectionName}</Typography>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mt={1}
              >
                <Typography
                  color="textSecondary"
                  ml={0}
                >
                  Token ID: {product.tokenId}
                </Typography>
                <Rating
                  name="read-only"
                  size="small"
                  value={5}
                  readOnly
                />
              </Stack>
            </CardContent>
          </BlankCard>
        </Grid>
      ))}
    </Grid>
    </DashboardCard> 
  );
};

export default NFT;
