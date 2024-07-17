import { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function Index() {

  return (
    <Page>
      <TitleBar title="Voiceflow-In-Store Settings"></TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Welcome to Voiceflow-In-Store! Let's get set up
                  </Text>
                  <Text as="p">
                    Go to your Voiceflow project and get your API key, ProjectID and VersionID. You should only have to do this once.
                  </Text>
                  <Text as = "p">
                    Now, inside `chat-box.js`, replace the `apiKey`, `projectId` and `versionId` with the values you got from Voiceflow.
                  </Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}