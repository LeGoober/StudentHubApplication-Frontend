import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getChannels, createChannel } from '../services/api';
import { setChannels } from '../store/slices/channelSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import { RootState } from '../store';

interface Channel {
  id: number;
  name: string;
}

const ChannelScreen: React.FC = () => {
  const [channelName, setChannelName] = useState('');
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const channels = useSelector((state: RootState) => state.channel.channels);

  useEffect(() => {
    if (token) {
      getChannels()
        .then((response) => {
          dispatch(setChannels(response.data));
        })
        .catch((error) => console.error('Failed to fetch channels:', error));
    }
  }, [token, dispatch]);

  const handleCreateChannel = async () => {
    if (token && channelName && user?.id) {
      try {
        await createChannel(channelName, user.id);
        const response = await getChannels();
        dispatch(setChannels(response.data));
        setChannelName('');
      } catch (error) {
        console.error('Failed to create channel:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 h-screen">
      <h1 className="text-2xl font-bold mb-4">Channels</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="New Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <Button onClick={handleCreateChannel}>Create Channel</Button>
      </div>
      <ul className="w-full max-w-md">
        {channels.map((channel: Channel) => (
          <li key={channel.id} className="p-2 border-b border-gray-200">
            {channel.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelScreen;