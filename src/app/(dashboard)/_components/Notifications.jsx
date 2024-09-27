import { useEffect, useState } from "react";
import { List, Badge, Popover, Button, Typography, Divider } from "antd";
import {
  BellOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setNotifications(data);
    setUnreadCount(data.filter((n) => !n.isRead).length);
    console.log("checking");
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch
    const intervalId = setInterval(fetchNotifications, 10000); // Fetch every 10 seconds

    return () => {
      clearInterval(intervalId); // Cleanup interval on unmount
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true, id }), // Mark as read
      });

      if (res.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead);
      const res = await Promise.all(
        unreadNotifications.map((notification) =>
          fetch(`/api/notifications`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isRead: true, id: notification.id }),
          })
        )
      );

      if (res.every((response) => response.ok)) {
        // Update state only if all requests succeeded
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
        setUnreadCount(0); // Reset unread count
      }
    } catch (error) {
      console.error("Error marking all notifications as read", error);
    }
  };

  const notificationContent = (
    <div style={{ width: 300 }}>
      <div className="flex justify-between items-center p-2">
        <Text strong>Notifications</Text>
        {unreadCount > 0 && (
          <Button size="small" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      <Divider style={{ margin: 0 }} />
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            onClick={() => !item.isRead && handleMarkAsRead(item.id)}
            style={{
              cursor: item.isRead ? "default" : "pointer",
              padding: "10px 20px",
              backgroundColor: item.isRead ? "#f0f2f5" : "#e6f7ff",
              borderBottom: "1px solid #f0f0f0",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!item.isRead)
                e.currentTarget.style.backgroundColor = "#e6f7ff";
            }}
            onMouseLeave={(e) => {
              if (!item.isRead) e.currentTarget.style.backgroundColor = "#fff";
            }}
          >
            <div className="flex items-center">
              {item.isRead ? (
                <CheckCircleOutlined className="text-green-500 mr-2" />
              ) : (
                <InfoCircleOutlined className="text-blue-500 mr-2" />
              )}
              <div style={{ flex: 1 }}>
                <Text strong={!item.isRead}>{item.message}</Text>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  {moment(item.createdAt).fromNow()}
                </div>
              </div>
            </div>
          </List.Item>
        )}
        locale={{
          emptyText: "No notifications",
        }}
      />
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      trigger="click"
      placement="bottomRight"
    >
      <div className="flex items-center cursor-pointer">
        <BellOutlined className="text-xl" />
        <Badge count={unreadCount} offset={[0, -10]} showZero />
      </div>
    </Popover>
  );
};

export default Notifications;
