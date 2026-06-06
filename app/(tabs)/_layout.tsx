import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  focused,
}: {
  name: IoniconName;
  focused: boolean;
}) {
  return (
    <Ionicons
      name={name}
      size={24}
      color={focused ? Colors.tabActive : Colors.tabInactive}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon
              name={focused ? 'add-circle' : 'add-circle-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon
              name={focused ? 'book' : 'book-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inspiration"
        options={{
          title: 'Inspire',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabIcon
              name={focused ? 'sparkles' : 'sparkles-outline'}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
