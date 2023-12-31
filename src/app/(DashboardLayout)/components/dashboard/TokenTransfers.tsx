import React, { useMemo } from "react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from "@mui/lab";
import useMySWR from "@/app/(DashboardLayout)/components/hooks/useMySWR";

export interface TokenTransfersIF {
  fromAddress: string,
  toAddress: string,
  contractAddress: string,
  value: string,
  valueRawInteger: string,
  blockchain: string,
  tokenName: string,
  tokenSymbol: string,
  tokenDecimals: number,
  thumbnail: string,
  transactionHash: string,
  blockHeight: number,
  timestamp: number
}

function formatTimestamp(timestamp: number): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  };

  const formattedDate = new Date(timestamp).toLocaleString('en-US', options);
  return formattedDate;
}

const TokenTransfers = () => {

  const { data: response } = useMySWR<{ data?: TokenTransfersIF[]  }>(
    ["https://api-asset-management-tqdpham.cyclic.app/api/v1/portfolio/token-transfers"],
    "get",
  );

  const txns: TokenTransfersIF[] = useMemo(() => (response?.data ? response.data : []), [response]);
  

  return (
    <DashboardCard title="Latest Token Transfers">
      <>
        <Timeline
          className="theme-timeline"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          sx={{
            p: 0,
            mb: { lg: "-15px" },
            "& .MuiTimelineConnector-root": {
              width: "1px",
              backgroundColor: "#efefef",
            },
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.7,
              paddingLeft: 0,
            },
          }}
        >
          {
            txns.map((e) => 
            <>
                <TimelineItem>
                  <TimelineOppositeContent>{formatTimestamp(e.timestamp*1000)}</TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary" variant="outlined" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    Transfer {Math.round(Number(e.value))} {e.tokenSymbol}
                  </TimelineContent>
                </TimelineItem>
              </>
            )
          }
        </Timeline>
      </>
    </DashboardCard>
  );
};

export default TokenTransfers;
