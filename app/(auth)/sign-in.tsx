import "@/global.css";
import { useAuth, useOAuth } from "@clerk/expo";
import { useSignIn } from "@clerk/expo/legacy";
import { FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const socialProviders = [
  { key: "oauth_google", label: "Google", tone: "light" },
  { key: "oauth_apple", label: "Apple", tone: "dark" },
] as const;

export default function SignInScreen() {
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const googleOAuth = useOAuth({ strategy: "oauth_google" });
  const appleOAuth = useOAuth({ strategy: "oauth_apple" });
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn]);

  if (!isAuthLoaded || !isSignInLoaded) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  const handleSignIn = async () => {
    if (!signIn || !setActive) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
        return;
      }

      setError("The sign-in flow is incomplete. Please try again.");
    } catch (err) {
      const clerkError =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors?: { message?: string }[] }).errors?.[0]?.message
          : undefined;
      setError(clerkError ?? "Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (
    provider: (typeof socialProviders)[number]["key"],
  ) => {
    const oauth = provider === "oauth_google" ? googleOAuth : appleOAuth;

    setIsSubmitting(true);
    setError(null);

    try {
      const { createdSessionId, setActive: activateSession } =
        await oauth.startOAuthFlow();

      if (createdSessionId && activateSession) {
        await activateSession({ session: createdSessionId });
        router.replace("/");
        return;
      }

      setError("The social sign-in flow is incomplete. Please try again.");
    } catch (err) {
      const clerkError =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors?: { message?: string }[] }).errors?.[0]?.message
          : undefined;
      setError(clerkError ?? "Unable to sign in with that provider.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-5 pt-20">
      <Text className="text-center text-5xl font-sans-extrabold text-accent">
        Recurly
      </Text>

      <View className="mt-6 items-center">
        <Text className="text-center text-3xl font-sans-bold text-primary">
          Welcome back
        </Text>
        <Text className="mt-2 max-w-[320px] text-center text-base font-sans-medium text-muted-foreground">
          Sign in to continue managing your subscriptions
        </Text>
      </View>

      <View className="mt-6 flex-row justify-center gap-3">
        {socialProviders.map((provider) => {
          const isDark = provider.tone === "dark";

          return (
            <Pressable
              key={provider.key}
              className={[
                "w-12 h-12 rounded-full items-center justify-center border",
                isDark
                  ? "border-border bg-foreground"
                  : "border-border bg-card",
              ].join(" ")}
              disabled={isSubmitting}
              onPress={() => handleSocialSignIn(provider.key)}
            >
              <FontAwesome
                name={provider.key === "oauth_google" ? "google" : "apple"}
                size={20}
                color={isDark ? "#fff" : "#081126"}
                accessibilityLabel={provider.label}
              />
            </Pressable>
          );
        })}
      </View>

      <View className="mt-5 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-border" />
        <Text className="text-[11px] font-sans-semibold uppercase tracking-[1px] text-muted-foreground">
          or continue with email
        </Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <View className="mt-8 rounded-3xl border border-border bg-card p-5">
        <View className="gap-4">
          <View className="gap-2">
            <Text className="text-sm font-sans-semibold text-primary">
              Email
            </Text>
            <TextInput
              className="rounded-2xl border border-border bg-background px-4 py-4 text-base text-primary"
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholder="Email"
              placeholderTextColor="#6b7280"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-sans-semibold text-primary">
              Password
            </Text>
            <View className="rounded-2xl border border-border bg-background px-4 py-3">
              <TextInput
                className="text-base text-primary"
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>
            <Text
              className="text-right text-sm font-sans-semibold text-accent"
              onPress={() => setShowPassword((value) => !value)}
            >
              {showPassword ? "Hide" : "Show"}
            </Text>
            <Text className="text-right text-sm font-sans-semibold text-accent">
              Forgot password?
            </Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View className="mt-1 rounded-2xl bg-accent px-4 py-4">
            <Button
              title={isSubmitting ? "Signing in..." : "Sign in"}
              onPress={handleSignIn}
              disabled={isSubmitting}
              color="#081126"
            />
          </View>
        </View>
      </View>

      <View className="mt-5 flex-row items-center justify-center gap-1">
        <Text className="text-sm font-sans-medium text-muted-foreground">
          New here?
        </Text>
        <Link href="/(auth)/sign-up" asChild>
          <Text className="text-sm font-sans-bold text-accent">
            Create an account
          </Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 24,
    top: 100,
    gap: 12,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  brand: {
    fontSize: 60,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: {
    color: "#b91c1c",
    fontSize: 14,
  },
  link: {
    marginTop: 8,
    textAlign: "center",
    color: "#2563eb",
    fontWeight: "600",
  },
});
