import { VisitSubmittedDataModal } from "@/modals/VisitSubmittedDataModal";
import { CampaignDocData } from "@/types/Campaign";
import { GetCampaignFunctionResponse } from "@/types/Contract";
import { SubmittedDataDocData } from "@/types/SubmitData";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Progress,
} from "@heroui/react";
import { useState } from "react";

type Props = {
  submittedData: SubmittedDataDocData;
  campaignDocData: GetCampaignFunctionResponse;
};

export function SubmittedDataPreviewCard({
  submittedData,
  campaignDocData,
}: Props) {
  const [isVisitSubmittedDataModalOpen, setIsVisitSubmittedDataModalOpen] =
    useState(false);

  const handlePressButton = () => {
    setIsVisitSubmittedDataModalOpen(true);
  };

  return (
    <>
      <Card
        isPressable
        isHoverable
        className=" max-w-[400px]"
        onPress={handlePressButton}
      >
        <CardHeader className="flex gap-3">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src={`https://picsum.photos/200/300?random=${submittedData.creatorId}`}
            width={40}
          />
          <div id="data-creator" className="flex flex-col">
            <div id="title" className=" text-xs text-default-500 text-left">
              Submitter Id
            </div>
            <div
              id="submitter-id"
              className=" text-small text-default-1000 text-left"
            >
              {submittedData.creatorId}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="gap-5">
          <div id="quality-part" className="flex flex-col">
            <Progress
              classNames={{
                base: "max-w-md",
                track: "drop-shadow-md border border-default",
                indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                label: "tracking-wider font-medium text-default-600",
                value: "text-foreground/60",
              }}
              label="Quality"
              radius="sm"
              showValueLabel={true}
              size="sm"
              value={submittedData.dataQuality}
            />
          </div>
          <div id="quality-part" className="flex flex-col">
            <Progress
              classNames={{
                base: "max-w-md",
                track: "drop-shadow-md border border-default",
                indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                label: "tracking-wider font-medium text-default-600",
                value: "text-foreground/60",
              }}
              label="Length"
              radius="sm"
              showValueLabel={true}
              size="sm"
              value={submittedData.dataLength}
              maxValue={100}
            />
          </div>

          <div id="cost-part" className="flex flex-col">
            <Progress
              classNames={{
                base: "max-w-md",
                track: "drop-shadow-md border border-default",
                indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                label: "tracking-wider font-medium text-default-600",
                value: "text-foreground/60",
              }}
              label="Cost"
              radius="sm"
              showValueLabel={true}
              size="sm"
              value={submittedData.earnedTokens}
              maxValue={campaignDocData.reward_pool}
            />
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          <Link isExternal showAnchorIcon onPress={handlePressButton}>
            Inspect
          </Link>
        </CardFooter>
      </Card>

      <VisitSubmittedDataModal
        isOpen={isVisitSubmittedDataModalOpen}
        setIsOpen={setIsVisitSubmittedDataModalOpen}
        submittedDataDocData={submittedData}
      />
    </>
  );
}
