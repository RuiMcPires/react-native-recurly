import { Link } from "expo-router";
import { Text, View } from "react-native";

const signIn = () => {
  return (
    <View>
      <Text>sign-in</Text>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded bg-primary px-4 py-2"
      >
        <Text className="text-white">Create Account</Text>
      </Link>
      <Link href="/">
        <Text className="text-white">Go to Home</Text>
      </Link>
    </View>
  );
};

export default signIn;
