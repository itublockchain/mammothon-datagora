import { CurrentCampaigns } from "./CurrentCampaigns";

export default function AppPage() {
  return (
    <div id="signed-main-page" className="flex flex-col p-5 md:px-20 md:py-10">
      <CurrentCampaigns />
    </div>
  );
}
