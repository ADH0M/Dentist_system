"use client";
import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { OverviewTab } from "./tabs/OverviewTab";
import { VisitsTab } from "./tabs/VisitsTab";
import { BillingTab } from "./tabs/BillingTab";
import { ImagesTab } from "./tabs/ImageTab";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex items-center gap-1 bg-card rounded-xl p-1 shadow-shadow-sm mb-6 sticky top-0 z-10">
          <Tabs.Trigger
            value="overview"
            className="flex-1 px-6 py-2.5 rounded-lg text-sm font-medium transition-all 
            data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
            data-[state=inactive]:text-muted-foreground 
            data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground"
          >
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger
            value="visits"
            className="flex-1 px-6 py-2.5 rounded-lg text-sm font-medium transition-all 
            data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
            data-[state=inactive]:text-muted-foreground 
            data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground"
          >
            Visits
          </Tabs.Trigger>
          <Tabs.Trigger
            value="billing"
            className="flex-1 px-6 py-2.5 rounded-lg text-sm font-medium transition-all 
            data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
            data-[state=inactive]:text-muted-foreground 
            data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground"
          >
            Billing
          </Tabs.Trigger>
          <Tabs.Trigger
            value="images"
            className="flex-1 px-6 py-2.5 rounded-lg text-sm font-medium transition-all 
            data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
            data-[state=inactive]:text-muted-foreground 
            data-[state=inactive]:hover:bg-accent data-[state=inactive]:hover:text-accent-foreground"
          >
            Images
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <OverviewTab />
        </Tabs.Content>

        <Tabs.Content value="visits">
          <VisitsTab />
        </Tabs.Content>

        <Tabs.Content value="billing">
          <BillingTab />
        </Tabs.Content>

        <Tabs.Content value="images">
          <ImagesTab />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default ProfilePage;
