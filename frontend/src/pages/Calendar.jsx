import React from 'react';
import { useQuery } from 'react-query';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { postsAPI } from '../services/api';

const Calendar = () => {
  const { data: posts = [] } = useQuery('posts', postsAPI.getAll);

  const events = posts.map(post => ({
    id: post._id,
    title: post.content.substring(0, 30) + '...',
    date: post.scheduledDate,
    backgroundColor: post.status === 'published' ? '#10b981' : '#3b82f6',
    borderColor: post.status === 'published' ? '#10b981' : '#3b82f6',
    extendedProps: {
      platforms: post.platforms,
      status: post.status,
      fullContent: post.content
    }
  }));

  const handleEventClick = (clickInfo) => {
    const { extendedProps } = clickInfo.event;
    alert(`Content: ${extendedProps.fullContent}\nPlatforms: ${extendedProps.platforms.join(', ')}\nStatus: ${extendedProps.status}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
        <p className="text-gray-600">View and manage your scheduled posts</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm">Scheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Published</span>
          </div>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          eventDisplay="block"
          dayMaxEvents={3}
        />
      </div>
    </div>
  );
};

export default Calendar;