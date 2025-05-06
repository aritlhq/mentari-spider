import { nextTick } from 'vue';
import { courseDetails, showPretestModal, pretestData } from './state';

export const closeModalOnOutsideClick = (event: MouseEvent) => {
    const modal = document.querySelector('.modal-content');
    if (modal && !modal.contains(event.target as Node)) {
        courseDetails.value = null;
    }
}

export const scrollToSection = (sectionId: string) => {
    nextTick(() => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

export const scrollToTop = () => {
    const container = document.getElementById('courseDetailsContainer');
    if (container) {
        container.scrollTop = 0;
    }
}

export const setupScrollButton = () => {
    nextTick(() => {
        const container = document.getElementById('courseDetailsContainer');
        const backToTopBtn = document.getElementById('backToTopBtn');

        if (container && backToTopBtn) {
            container.addEventListener('scroll', () => {
                if (container.scrollTop > 300) {
                    backToTopBtn.classList.remove('hidden');
                } else {
                    backToTopBtn.classList.add('hidden');
                }
            });
        }
    });
}

export const closePretestOnOutsideClick = (event: MouseEvent) => {
    const modal = document.querySelector('.pretest-modal-content');
    if (modal && !modal.contains(event.target as Node)) {
        closePretest();
    }
};

export const closePretest = () => {
    showPretestModal.value = false;
    pretestData.value = null;
}