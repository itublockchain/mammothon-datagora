import { useAptosClient } from "@/helpers/useAptosClient";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Slider,
  Textarea,
} from "@heroui/react";

import { convertBalance } from "@/helpers/campaignHelpers";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
};

export function CreateCampaignModal({ isModalOpen, setIsModalOpen }: Props) {
  const [isCreateLoading, setIsCreateLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [stakedBalance, setStakedBalance] = useState("");
  const [dataSpec, setDataSpec] = useState("");

  const [minimumQualityScore, setMinimumQualityScore] = useState(70);

  const [isPremium, setIsPremium] = useState(false);
  const [minimumContributonCount, setMinimumContributonCount] = useState(0);

  const [dataKeyPair, setDataKeyPair] = useState<null | {
    publicKey: number[];
    privateKey: string;
  }>(null);

  const [isPrivateKeyDownloaded, setIsPrivateKeyDownloaded] = useState(false);

  const [validationErrors, setValidationErrors] = useState({
    title: "empty",
    description: "empty",
    dataSpec: "empty",
    unitPrice: "empty",
    statkedBalance: "empty",
    minimumQualityScore: "",
  });

  const [isInputsValid, setIsInputsValid] = useState(false);

  const [creationError, setCreationError] = useState("");

  const router = useRouter();

  const {
    createCampaign,
    isAptosClientReady,
    getSubscriptionStatus,
    getLastCreatedCampaignOfCurrentUser,
  } = useAptosClient();

  const { account } = useWallet();

  // Managing creating new key pair on modal open.
  useEffect(() => {
    if (!isModalOpen) {
      resetInputs();
    }
    handleCreateNewDataKeyPair();
  }, [isModalOpen]);

  useEffect(() => {
    if (!isAptosClientReady || !isModalOpen) return;

    getSubscriptionStatus().then((status) => {
      if (status) setIsPremium(status.status);
    });
  }, [isModalOpen, isAptosClientReady]);

  // Clearing States On Close and Initially
  useEffect(() => {
    resetInputs();
  }, [isModalOpen]);

  // Managing isInputsValid state
  useEffect(() => {
    if (
      validationErrors.dataSpec ||
      validationErrors.description ||
      validationErrors.statkedBalance ||
      validationErrors.title ||
      validationErrors.unitPrice ||
      validationErrors.minimumQualityScore
    ) {
      setIsInputsValid(false);
    } else {
      setIsInputsValid(true);
    }
  }, [validationErrors]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value.length === 0) {
      setValidationErrors({
        ...validationErrors,
        title: "Title is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        title: "",
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      setValidationErrors({
        ...validationErrors,
        description: "Description is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        description: "",
      });
    }
    setDescription(e.target.value);
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handling Validation Errors
    if (e.target.value.length === 0 || Number(e.target.value) <= 0) {
      setValidationErrors({
        ...validationErrors,
        unitPrice: "Price offer is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        unitPrice: "",
      });
    }

    setUnitPrice(e.target.value);
  };

  const handleStakedBalanceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value.length === 0 || Number(e.target.value) <= 0) {
      setValidationErrors({
        ...validationErrors,
        statkedBalance: "Staked balance is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        statkedBalance: "",
      });
    }

    setStakedBalance(e.target.value);
  };

  const handleDataSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 0) {
      setValidationErrors({
        ...validationErrors,
        dataSpec: "Data Spec is required",
      });
    } else {
      setValidationErrors({
        ...validationErrors,
        dataSpec: "",
      });
    }

    setDataSpec(e.target.value);
  };

  const handleCreateNewDataKeyPair = async () => {
    if (isCreateLoading) return;

    setDataKeyPair(null);
    setIsPrivateKeyDownloaded(false);

    try {
      const bufferToHex = (buffer: ArrayBuffer) =>
        Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

      const algorithm = {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      };

      const keyPair = await window.crypto.subtle.generateKey(
        algorithm,
        true, // key'ler dışa aktarılabilir
        ["encrypt", "decrypt"]
      );

      const publicKeyDer = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
      );

      const privateKeyDer = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
      );

      // Converting to hex for user readability.
      const privateKeyHex = bufferToHex(privateKeyDer);

      // Converting public to number array for contract interaction compatibility.
      const publicKeyNumberArray = Array.from(new Uint8Array(publicKeyDer));

      return setDataKeyPair({
        publicKey: publicKeyNumberArray,
        privateKey: privateKeyHex,
      });
    } catch (error) {
      console.error("Error on handleCreateNewKeyButton: ", error);

      setIsPrivateKeyDownloaded(false);
      return setDataKeyPair(null);
    }
  };

  const handleDownloadPrivateKeyButton = () => {
    const privateKey = dataKeyPair?.privateKey;
    if (!privateKey) {
      console.error("Error: Private key not found");
      return setIsPrivateKeyDownloaded(false);
    }

    try {
      // Build the JSON object with the desired structure.
      const keyData = {
        owner: account?.address || "Account Not Found!", // Replace with the actual owner value if available.
        private_key: privateKey, // Use the retrieved private key.
        created_at: Date.now(), // Timestamp when the key was downloaded.
      };

      // Convert the object to a formatted JSON string.
      const jsonData = JSON.stringify(keyData, null, 2);

      // Create a Blob with the JSON data.
      const blob = new Blob([jsonData], { type: "application/json" });

      // Create a temporary URL for the Blob.
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element for the download.
      const a = document.createElement("a");
      a.href = url;
      a.download = "key-" + Date.now().toString() + ".json"; // Set the filename with a .json extension.

      // Trigger the download.
      document.body.appendChild(a);
      a.click();

      // Cleanup: Remove the anchor and revoke the URL.
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsPrivateKeyDownloaded(true);
    } catch (error) {
      console.error("Error: Failed to download data", error);
      return setIsPrivateKeyDownloaded(false);
    }
  };

  const handleCancelButton = () => {
    setIsModalOpen(false);
    resetInputs();
  };

  const handleCreateButton = async () => {
    if (isCreateLoading) return;

    setCreationError("");

    if (
      !title ||
      !description ||
      !dataSpec ||
      !unitPrice ||
      Number(unitPrice) <= 0 ||
      !stakedBalance ||
      Number(stakedBalance) <= 0 ||
      !minimumQualityScore
    ) {
      return setValidationErrors({
        title: !title ? "Title is required" : "",
        description: !description ? "Description is required" : "",
        statkedBalance:
          !stakedBalance || Number(unitPrice) <= 0
            ? "Staked balance is required"
            : "",
        unitPrice:
          !unitPrice || Number(unitPrice) <= 0 ? "Unit price is required" : "",
        dataSpec: !dataSpec ? "Data Spec is required" : "",
        minimumQualityScore: !minimumQualityScore
          ? "Minimum quality score is required"
          : "",
      });
    }

    if (!dataKeyPair) {
      console.error("Please create a key pair to continue.");
      return setCreationError("Please create a key pair");
    }

    if (!isPrivateKeyDownloaded) {
      console.error("Please download the private key to continue.");
      return setCreationError("Please download the private key.");
    }

    setIsCreateLoading(true);

    const rewardPoolBigInt = convertToBIGInt(stakedBalance);
    if (!rewardPoolBigInt) {
      setCreationError("Failed to convert staked balance to BigInt");
      return setIsCreateLoading(false);
    }

    const unitPriceBigInt = convertToBIGInt(unitPrice);
    if (!unitPriceBigInt) {
      setCreationError("Failed to convert unit price to BigInt");
      return setIsCreateLoading(false);
    }

    const result = await createCampaign({
      title: title,
      description: description,
      dataSpec: dataSpec,
      minimumScore: minimumQualityScore,
      minimumContribution: 0,
      rewardPool: rewardPoolBigInt,
      unitPrice: unitPriceBigInt,
      publicKeyForEncryption: dataKeyPair.publicKey,
    });

    if (!result) {
      setCreationError("Failed to create campaign");
      return setIsCreateLoading(false);
    }

    // Getting last created campaign and redirecting to it.
    const lastCreatedCampaign = await getLastCreatedCampaignOfCurrentUser();
    if (!lastCreatedCampaign) {
      console.error("Failed to get last created campaign of user");
      return setIsCreateLoading(false);
    }

    const campaignId = lastCreatedCampaign.id;

    // Redirect to campaign page.
    router.push(`/app/campaigns/${campaignId}`);

    setIsCreateLoading(false);
    resetInputs();

    toast.success("Campaign created successfully!");

    return setIsModalOpen(false);
  };

  const resetInputs = () => {
    setTitle("");
    setDescription("");
    setUnitPrice("");
    setStakedBalance("");
    setDataSpec("");
    setDataKeyPair(null);
    setIsPrivateKeyDownloaded(false);
    setMinimumQualityScore(70);
    setMinimumContributonCount(0);
    setCreationError("");
    setValidationErrors({
      title: "empty",
      description: "empty",
      dataSpec: "empty",
      unitPrice: "empty",
      statkedBalance: "empty",
      minimumQualityScore: "",
    });
  };

  const convertToBIGInt = (value: string) => {
    try {
      const result = Number(
        BigInt(
          Math.round(convertBalance(Number(value.replace(",", ".")), true))
        )
      );
      return result;
    } catch (error) {
      console.error("Error on convertToBIGInt: ", error);
      return false;
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelButton}
        scrollBehavior="outside"
        size="xl"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Create Campaign
          </ModalHeader>

          <ModalBody>
            <Input
              isRequired
              label="Title"
              placeholder="Enter title for your campaign..."
              onChange={handleTitleChange}
              value={title}
              minLength={15}
              maxLength={100}
            />

            <Textarea
              isRequired
              label="Description"
              placeholder="Enter description for your campaign..."
              onChange={handleDescriptionChange}
              value={description}
              minLength={50}
              maxLength={1000}
            />

            <Input
              isRequired
              label="Unit Price ($DATA)"
              onChange={handleUnitPriceChange}
              value={unitPrice.toString()}
            />

            <Input
              isRequired
              label="Staked Balance ($DATA)"
              onChange={handleStakedBalanceChange}
              value={stakedBalance.toString()}
            />

            <Textarea
              isRequired
              label="Data Spec"
              placeholder="Enter data spec for your campaign..."
              onChange={handleDataSpecChange}
              value={dataSpec}
              minLength={50}
              maxLength={2000}
            />

            <Slider
              className=""
              label="Select a minimum quality score"
              marks={[
                {
                  value: 20,
                  label: "20%",
                },
                {
                  value: 50,
                  label: "50%",
                },
                {
                  value: 80,
                  label: "80%",
                },
              ]}
              value={minimumQualityScore}
              onChange={(value) => setMinimumQualityScore(value as number)}
              minValue={0}
              maxValue={100}
              step={1}
            />

            <Slider
              label="Select a minimum contribution count (Premium)"
              marks={[
                {
                  value: 0,
                  label: "0",
                },
                {
                  value: 5,
                  label: "5",
                },
                {
                  value: 10,
                  label: "10",
                },
              ]}
              value={minimumContributonCount}
              onChange={(value) => setMinimumContributonCount(value as number)}
              minValue={0}
              maxValue={20}
              step={1}
              isDisabled={!isPremium}
            />

            <div className=" text-xs text-warning-500">
              Plase download your private key and keep it safe. You will need it
              to decrypt the data.
            </div>

            <Input
              className="text-xs"
              value={
                (dataKeyPair &&
                  dataKeyPair.privateKey.slice(
                    dataKeyPair.privateKey.length - 60,
                    dataKeyPair.privateKey.length - 15
                  ) + "...") ||
                "Please create a key pair"
              }
              label="Private Key"
              endContent={
                <div className="flex flex-row items-center justify-end gap-5 w-[30%] h-full">
                  <div
                    id="download-icon"
                    className="flex justify-center items-center cursor-pointer"
                    onClick={handleDownloadPrivateKeyButton}
                  >
                    <img src="/campaign/download.png" className="w-6 h-6" />
                  </div>

                  <div
                    id="shuffle-icon"
                    className="flex justify-center items-center cursor-pointer"
                    onClick={handleCreateNewDataKeyPair}
                  >
                    <img src="/campaign/shufflee.png" className="w-6 h-6" />
                  </div>
                </div>
              }
            />

            {creationError && (
              <div className="text-xs self-center text-danger-500">
                {creationError}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              color="secondary"
              variant="light"
              onPress={handleCancelButton}
              isDisabled={isCreateLoading}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateButton}
              isDisabled={
                isCreateLoading || !isPrivateKeyDownloaded || !isInputsValid
              }
              isLoading={isCreateLoading}
              className="text-black"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
