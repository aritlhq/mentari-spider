import { meetingData } from "./state";

export const closeModalOnOutsideClick = (event: MouseEvent) => {
    const modal = document.querySelector('.modal-content');
    if(modal && !modal.contains(event.target as Node)) {
        meetingData.value = null; // Reset meetingData value to null
    }
}

export const getStatusClass = (status: string) => {
    return {
        'hadir': 'text-yellow-500',
        'null': 'text-red-500'
    }[status] || 'text-red-500'
}

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}