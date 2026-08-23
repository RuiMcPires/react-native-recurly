import { Link } from "expo-router";
import { Text, View } from "react-native";

const signUp = () => {
  return (
    <View>
      <Text>sign-up</Text>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-primary px-4 py-2"
      >
        <Text className="text-white">Already have an account? Sign In</Text>
      </Link>
      <Link href="/">
        <Text className="text-white">Go to Home</Text>
      </Link>
    </View>
  );
};

export default signUp;
