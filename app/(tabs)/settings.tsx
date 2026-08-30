import React from "react";
import { Text, View, Pressable } from "react-native";

import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);
import { useAuth, useUser } from "@clerk/expo";

const Settings = () => {
  const { isLoaded, signOut } = useAuth();
  const { user } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-20">
      <Text className="text-center text-5xl font-sans-extrabold text-accent">
        Recurly
      </Text>

      <View className="mt-6 items-center">
        <Text className="text-center text-3xl font-sans-bold text-primary">
          Settings
        </Text>
        <Text className="mt-2 max-w-[320px] text-center text-base font-sans-medium text-muted-foreground">
          Manage your account and sign out to test the auth flow.
        </Text>
      </View>

      <View className="mt-8 rounded-3xl border border-border bg-card p-5">
        <View className="gap-4">
          <View>
            <Text className="text-sm font-sans-semibold text-primary">Name</Text>
            <Text className="text-base font-sans-medium text-primary">
              {user?.firstName || user?.fullName || "—"}
            </Text>
          </View>

          <View>
            <Text className="text-sm font-sans-semibold text-primary">Email</Text>
            <Text className="text-base font-sans-medium text-primary">
              {user?.primaryEmailAddress?.emailAddress || "—"}
            </Text>
          </View>

          <Pressable
            onPress={() => void signOut()}
            disabled={!isLoaded}
            className={!isLoaded ? "auth-button auth-button-disabled" : "auth-button"}
          >
            <Text className="auth-button-text">Sign out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
