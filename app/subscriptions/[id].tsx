import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";

import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>Subscription Details: {id}</Text>
    </SafeAreaView>
  );
};

export default SubscriptionDetails;
