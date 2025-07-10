import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  StatusBar,
  ScrollView, // Import ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function App() {
  // Define the API endpoint for sending feedback
  const API_ENDPOINT =
    "https://<id>.execute-api.us-east-1.amazonaws.com/default/customer_feedback_lambda";

  // Mock data for the transaction alert
  const mockTransaction = {
    id: "txn-frd-001",
    merchant: "Shady Electronics",
    amount: "1,999.99",
    currency: "USD",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackResponse, setFeedbackResponse] = useState("");

  /**
   * Handles sending feedback to the API.
   * @param {string} response - The user's response ('yes' or 'no').
   */
  const handleFeedback = async (response: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setFeedbackSent(false);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: mockTransaction.id,
          response: response,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "An error occurred.");
      }

      setFeedbackResponse(data.message);
    } catch (error: any) {
      setFeedbackResponse(error.message);
    } finally {
      setIsLoading(false);
      setFeedbackSent(true);
    }
  };

    /**
   * Resets the state to go back to the initial security alert screen.
   */
  const handleTryAnotherDemo = () => {
    setFeedbackSent(false); // Go back to the initial screen
    setFeedbackResponse(''); // Clear any previous feedback response
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Main content container */}
      <View className="flex-1 items-center justify-center p-6">
        {feedbackSent ? (
          // Feedback sent confirmation screen
          <View className="items-center px-4">
            <View className="w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-6">
              <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            </View>
            <Text className="text-4xl font-bold mb-3 text-center text-gray-900">
              Thank You!
            </Text>
            <Text className="text-lg text-gray-500 text-center leading-relaxed mb-8">
              {feedbackResponse}
            </Text>
            <TouchableOpacity
              onPress={handleTryAnotherDemo}
              className="bg-blue-500 rounded-2xl py-4 items-center justify-center w-80"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-semibold">
                Try Another Demo
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Security alert and transaction details screen
          // Use ScrollView to make the content scrollable if it overflows
          <View className="flex-1 w-full px-6">
            {/* <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}> */}
              
                <View className="items-center justify-center mb-5">
                  <Ionicons name="warning" size={30} color="#EF4444" />
                </View>
              
              <View className="items-center mb-6">
                <Text className="text-4xl font-bold text-gray-900 mb-2 text-center">
                  Security Alert
                </Text>
                <Text className="text-xl text-gray-500 text-center">
                  Suspicious transaction detected
                </Text>
              </View>
              {/* Transaction Details Card */}
              <View className="bg-white rounded-2xl p-6 mx-2 my-4 shadow-md border border-gray-100">
                <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
                  $1,250
                </Text>
                <Text className="text-xl font-semibold text-gray-600 text-center mb-6">
                  Luxury Electronics Store
                </Text>
                <View className="flex-row items-center justify-center mb-3">
                  <Ionicons name="location-outline" size={20} color="#6B7280" />
                  <Text className="text-lg text-gray-600 ml-2">
                    Beverly Hills, CA
                  </Text>
                </View>
                <View className="flex-row items-center justify-center">
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
                  <Text className="text-lg text-gray-600 ml-2">
                    6/24/2025, 11:25:08 AM
                  </Text>
                </View>
              </View>
              <View className="items-center mb-8">
                <Text className="text-3xl font-bold text-gray-900 mb-3 text-center">
                  Was this you?
                </Text>
                <Text className="text-lg text-gray-500 text-center px-4">
                  We detected unusual activity on your account
                </Text>
              </View>
            
              {/* Action Buttons - fixed at the bottom */}
              <View className="pb-10 w-full items-center">
                <TouchableOpacity
                  onPress={() => handleFeedback("yes")}
                  className="bg-green-500 rounded-2xl py-4 mb-4 flex-row items-center justify-center w-full max-w-xs"
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark" size={24} color="white" />
                  <Text className="text-white text-lg font-semibold ml-2">
                    Yes, this was me
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleFeedback("no")}
                  className="bg-red-500 rounded-2xl py-4 flex-row items-center justify-center w-full max-w-xs"
                  activeOpacity={0.8}
                >
                  <Ionicons name="close" size={24} color="white" />
                  <Text className="text-white text-lg font-semibold ml-2">
                    No, this was not me
                  </Text>
                </TouchableOpacity>
              </View>
            {/* </ScrollView>  */}
          </View>
        )}
        {/* Loading Modal */}
        <Modal transparent={true} animationType="fade" visible={isLoading}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
