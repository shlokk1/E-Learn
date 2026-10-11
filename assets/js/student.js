/**
 * Student Layout Logic
 * Injects the sidebar and header into all student pages to keep HTML DRY.
 */
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('app-sidebar');
    const header = document.getElementById('app-header');
    const currentPage = document.body.getAttribute('data-page');

    if(sidebar) {
        sidebar.innerHTML = `
            <div class="app-sidebar-header">
                <i class="ph ph-book-open"></i> <span>EduPortal</span>
            </div>
            <nav class="app-sidebar-nav">
                <a href="dashboard.html" class="nav-item ${currentPage === 'dashboard' ? 'active' : ''}"><i class="ph ph-squares-four"></i> Dashboard</a>
                <a href="doubts.html" class="nav-item ${['doubts', 'ask-doubt', 'doubt-details'].includes(currentPage) ? 'active' : ''}"><i class="ph ph-question"></i> My Doubts</a>
                <a href="sessions.html" class="nav-item ${['sessions', 'session-room'].includes(currentPage) ? 'active' : ''}"><i class="ph ph-chalkboard-teacher"></i> 1:1 Sessions</a>
                <a href="library.html" class="nav-item ${['library', 'resource-viewer'].includes(currentPage) ? 'active' : ''}"><i class="ph ph-books"></i> Digital Library</a>
                <a href="community.html" class="nav-item ${['community', 'discussion', 'ask-community'].includes(currentPage) ? 'active' : ''}"><i class="ph ph-users"></i> Student Community</a>
                <a href="announcements.html" class="nav-item ${currentPage === 'announcements' ? 'active' : ''}"><i class="ph ph-megaphone"></i> Announcements</a>
                <a href="notifications.html" class="nav-item ${currentPage === 'notifications' ? 'active' : ''}"><i class="ph ph-bell"></i> Notifications</a>
                <a href="activity.html" class="nav-item ${currentPage === 'activity' ? 'active' : ''}"><i class="ph ph-chart-line-up"></i> My Activity</a>
            </nav>
            <div style="padding: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                <a href="profile.html" class="nav-item ${currentPage === 'profile' ? 'active' : ''}"><i class="ph ph-user"></i> Profile</a>
                <a href="settings.html" class="nav-item ${currentPage === 'settings' ? 'active' : ''}"><i class="ph ph-gear"></i> Settings</a>
                <a href="../auth/login.html" class="nav-item" onclick="sessionStorage.removeItem('currentUser'); localStorage.removeItem('currentUser');"><i class="ph ph-sign-out"></i> Logout</a>
            </div>
        `;
    }

    if(header) {
        const user = MOCK_DATA.getUser();
        header.innerHTML = `
            <div class="header-left">
                <button class="menu-toggle" id="main-menu-toggle" title="Toggle Sidebar"><i class="ph ph-list"></i></button>
                <div class="hide-on-mobile">
                    <h2 style="margin: 0; font-size: 1.15rem; color: var(--text-main);">Class ${user.class} &middot; Division ${user.division}</h2>
                </div>
            </div>
            <div class="header-right">
                <button class="btn-icon theme-toggle" onclick="if(typeof toggleTheme === 'function') toggleTheme()" title="Toggle Theme"><i class="ph ph-moon"></i></button>
                <a href="notifications.html" class="btn-icon" style="position:relative;" title="Notifications">
                    <i class="ph ph-bell"></i>
                    <span style="position:absolute; top:4px; right:4px; width:8px; height:8px; background:var(--status-danger); border-radius:50%;"></span>
                </a>
                <a href="profile.html" style="display:flex; align-items:center; gap:0.5rem; text-decoration:none; margin-left: 0.5rem;">
                    <div style="width:36px; height:36px; border-radius:50%; background:var(--primary-color); color:white; display:flex; align-items:center; justify-content:center; font-weight: 600;">
                        ${user.name.charAt(0)}
                    </div>
                </a>
            </div>
        `;
        
        // Bind Sidebar Toggle (Mobile & Desktop)
        const menuBtn = document.getElementById('main-menu-toggle');
        const appContainer = document.querySelector('.app-container');
        if (menuBtn && sidebar && appContainer) {
            menuBtn.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.toggle('open');
                } else {
                    appContainer.classList.toggle('sidebar-collapsed');
                }
            });
        }
    }

    // Digital Library Filter & Search
    if (currentPage === 'library') {
        initLibraryFilters();
    }

    // Student Community Feed & Filter
    if (currentPage === 'community') {
        initCommunityPage();
    }

    // Student Discussion Details
    if (currentPage === 'discussion') {
        initDiscussionPage();
    }
});

// ==========================================
// Digital Library: Client-side Search & Filter
// ==========================================
function initLibraryFilters() {
    const searchInput = document.getElementById('librarySearchInput');
    const subjectFilter = document.getElementById('librarySubjectFilter');
    const typeFilter = document.getElementById('libraryTypeFilter');
    const searchBtn = document.getElementById('librarySearchBtn');
    const resetBtn = document.getElementById('libraryResetBtn');
    const grid = document.getElementById('libraryGrid');
    const emptyState = document.getElementById('libraryEmptyState');

    if (!grid) return;
    const cards = grid.querySelectorAll('.resource-card');

    function filterResources() {
        const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const selectedSubject = (subjectFilter ? subjectFilter.value : 'all').toLowerCase();
        const selectedType = (typeFilter ? typeFilter.value : 'all').toLowerCase();

        let visibleCount = 0;

        cards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const subject = (card.getAttribute('data-subject') || '').toLowerCase();
            const type = (card.getAttribute('data-type') || '').toLowerCase();

            const matchesQuery = !query || cardText.includes(query);
            const matchesSubject = selectedSubject === 'all' || subject === selectedSubject || cardText.includes(selectedSubject);
            const matchesType = selectedType === 'all' || type === selectedType || cardText.includes(selectedType);

            if (matchesQuery && matchesSubject && matchesType) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        if (resetBtn) {
            const isFiltered = query !== '' || selectedSubject !== 'all' || selectedType !== 'all';
            resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterResources);
    if (subjectFilter) subjectFilter.addEventListener('change', filterResources);
    if (typeFilter) typeFilter.addEventListener('change', filterResources);
    if (searchBtn) searchBtn.addEventListener('click', (e) => { e.preventDefault(); filterResources(); });
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetLibraryFilters();
        });
    }
}

window.resetLibraryFilters = function() {
    const searchInput = document.getElementById('librarySearchInput');
    const subjectFilter = document.getElementById('librarySubjectFilter');
    const typeFilter = document.getElementById('libraryTypeFilter');
    if (searchInput) searchInput.value = '';
    if (subjectFilter) subjectFilter.value = 'all';
    if (typeFilter) typeFilter.value = 'all';

    const grid = document.getElementById('libraryGrid');
    if (grid) {
        grid.querySelectorAll('.resource-card').forEach(card => card.style.display = '');
    }
    const emptyState = document.getElementById('libraryEmptyState');
    if (emptyState) emptyState.style.display = 'none';
    const resetBtn = document.getElementById('libraryResetBtn');
    if (resetBtn) resetBtn.style.display = 'none';
};

// ==========================================
// Student Community: Feed, Search, and Live Likes
// ==========================================
function initCommunityPage() {
    renderCommunityDiscussions();
    initCommunityFilters();

    // Re-render when community data updates
    window.addEventListener('community-updated', () => {
        renderCommunityDiscussions();
        initCommunityFilters();
    });
}

function renderCommunityDiscussions() {
    const list = document.getElementById('communityDiscussionsList');
    if (!list) return;
    const discussions = MOCK_DATA.getDiscussions();

    list.innerHTML = discussions.map(d => {
        const isLiked = MOCK_DATA.isLikedByUser(d.id);
        const replyCount = (d.replies && d.replies.length) || 0;
        const likeCount = d.likes || 0;
        return `
            <a href="discussion.html?id=${d.id}" class="list-card" style="display: block; text-decoration: none; color: inherit;" data-topic="${d.topic || 'general'}">
                <div class="list-card-header">
                    <div style="flex: 1; padding-right: 1rem;">
                        <h4 style="color: var(--primary-color); margin-bottom: 0.35rem;">${escapeHtml(d.title)}</h4>
                        <p class="text-muted mt-1" style="font-size: 0.9rem; margin-bottom: 0.5rem;">${escapeHtml(d.content)}</p>
                        <div class="mt-2" style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 1.25rem;">
                            <span><i class="ph ph-chat-circle"></i> <span id="reply-count-${d.id}">${replyCount}</span> Replies</span>
                            <button type="button" class="btn-like-inline ${isLiked ? 'liked' : ''}" onclick="handleCommunityCardLike(event, '${d.id}')" title="${isLiked ? 'You liked this (click to unlike)' : 'Like this question'}">
                                <i class="${isLiked ? 'ph-fill' : 'ph'} ph-thumbs-up"></i> <span id="like-count-${d.id}">${likeCount}</span> Helpful
                            </button>
                        </div>
                    </div>
                    <span class="badge ${d.badgeClass || 'badge-info'}">${d.subject || 'General'}</span>
                </div>
            </a>
        `;
    }).join('');
}

window.handleCommunityCardLike = function(event, discId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const res = MOCK_DATA.toggleLike(discId);
    const countSpan = document.getElementById(`like-count-${discId}`);
    if (countSpan) countSpan.textContent = res.likes;

    const likeBtn = event ? event.currentTarget : null;
    if (likeBtn) {
        const icon = likeBtn.querySelector('i');
        if (res.liked) {
            likeBtn.classList.add('liked');
            if (icon) icon.className = 'ph-fill ph-thumbs-up';
            likeBtn.title = 'You liked this (click to unlike)';
        } else {
            likeBtn.classList.remove('liked');
            if (icon) icon.className = 'ph ph-thumbs-up';
            likeBtn.title = 'Like this question';
        }
    }
};

function initCommunityFilters() {
    const searchInput = document.getElementById('communitySearchInput');
    const topicFilter = document.getElementById('communityTopicFilter');
    const searchBtn = document.getElementById('communitySearchBtn');
    const resetBtn = document.getElementById('communityResetBtn');
    const list = document.getElementById('communityDiscussionsList');
    const emptyState = document.getElementById('communityEmptyState');

    if (!list) return;

    function filterDiscussions() {
        const cards = list.querySelectorAll('.list-card');
        const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
        const selectedTopic = (topicFilter ? topicFilter.value : 'all').toLowerCase();

        let visibleCount = 0;

        cards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const topic = (card.getAttribute('data-topic') || '').toLowerCase();

            const matchesQuery = !query || cardText.includes(query);
            const matchesTopic = selectedTopic === 'all' || topic === selectedTopic || cardText.includes(selectedTopic);

            if (matchesQuery && matchesTopic) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        if (resetBtn) {
            const isFiltered = query !== '' || selectedTopic !== 'all';
            resetBtn.style.display = isFiltered ? 'inline-flex' : 'none';
        }
    }

    if (searchInput) searchInput.addEventListener('input', filterDiscussions);
    if (topicFilter) topicFilter.addEventListener('change', filterDiscussions);
    if (searchBtn) searchBtn.addEventListener('click', (e) => { e.preventDefault(); filterDiscussions(); });
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resetCommunityFilters();
        });
    }
}

window.resetCommunityFilters = function() {
    const searchInput = document.getElementById('communitySearchInput');
    const topicFilter = document.getElementById('communityTopicFilter');
    if (searchInput) searchInput.value = '';
    if (topicFilter) topicFilter.value = 'all';

    const list = document.getElementById('communityDiscussionsList');
    if (list) {
        list.querySelectorAll('.list-card').forEach(card => card.style.display = '');
    }
    const emptyState = document.getElementById('communityEmptyState');
    if (emptyState) emptyState.style.display = 'none';
    const resetBtn = document.getElementById('communityResetBtn');
    if (resetBtn) resetBtn.style.display = 'none';
};

// ==========================================
// Community Discussion Detail & Live Replies
// ==========================================
let currentDiscussionId = 'disc-1';

function initDiscussionPage() {
    const urlParams = new URLSearchParams(window.location.search);
    currentDiscussionId = urlParams.get('id') || 'disc-1';

    const disc = MOCK_DATA.getDiscussion(currentDiscussionId);
    if (!disc) return;

    // Populate Main Post Header and Body
    const badge = document.getElementById('postBadge');
    if (badge) {
        badge.className = `badge ${disc.badgeClass || 'badge-info'} mb-2`;
        badge.textContent = disc.subject || 'Discussion';
    }

    const title = document.getElementById('postTitle');
    if (title) title.textContent = disc.title;

    const author = document.getElementById('postAuthor');
    if (author) author.textContent = disc.author;

    const time = document.getElementById('postTime');
    if (time) time.textContent = disc.timeAgo;

    const content = document.getElementById('postContent');
    if (content) content.textContent = disc.content;

    updateDiscussionLikeButton(disc);
    renderDiscussionReplies(disc);
}

function updateDiscussionLikeButton(disc) {
    const likeBtn = document.getElementById('postLikeBtn');
    const likeCount = document.getElementById('postLikeCount');
    const likeIcon = document.getElementById('postLikeIcon');
    if (!likeBtn) return;

    const isLiked = MOCK_DATA.isLikedByUser(disc.id);
    if (likeCount) likeCount.textContent = disc.likes || 0;

    if (isLiked) {
        likeBtn.className = 'btn btn-primary liked';
        if (likeIcon) likeIcon.className = 'ph-fill ph-thumbs-up';
        likeBtn.title = 'You found this helpful (click to unlike)';
    } else {
        likeBtn.className = 'btn btn-secondary';
        if (likeIcon) likeIcon.className = 'ph ph-thumbs-up';
        likeBtn.title = 'Mark as helpful';
    }
}

window.handleDiscussionLike = function() {
    const res = MOCK_DATA.toggleLike(currentDiscussionId);
    const disc = MOCK_DATA.getDiscussion(currentDiscussionId);
    updateDiscussionLikeButton(disc);
};

function renderDiscussionReplies(disc) {
    const container = document.getElementById('repliesContainer');
    const heading = document.getElementById('repliesHeading');
    const replies = disc.replies || [];

    if (heading) {
        heading.textContent = `Replies (${replies.length})`;
    }

    if (!container) return;

    if (replies.length === 0) {
        container.innerHTML = `
            <div class="card mb-4" style="text-align: center; padding: 2rem 1rem; color: var(--text-muted);">
                <i class="ph ph-chat-circle-dots" style="font-size: 2rem; display: block; margin-bottom: 0.5rem;"></i>
                <p style="margin-bottom: 0;">No replies yet. Be the first to share your thoughts!</p>
            </div>
        `;
        return;
    }

    const currentUser = MOCK_DATA.getUser();
    const currentUserId = currentUser.email || currentUser.name || 'current_user';

    container.innerHTML = replies.map(r => {
        const isMyReply = (r.userId && (r.userId === currentUserId || r.userId === currentUser.name || r.userId === currentUser.email)) ||
                          (r.author && (r.author === currentUser.name || r.author.startsWith(currentUser.name)));

        return `
        <div class="card mb-3" id="${r.id}">
            <div class="card-body" style="padding: 1.25rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <p class="text-muted" style="font-size: 0.85rem; margin-bottom: 0;">
                        <strong>${escapeHtml(r.author)}</strong>${isMyReply ? ' <span class="badge badge-info" style="font-size: 0.7rem; padding: 0.15rem 0.4rem; vertical-align: middle;">You</span>' : ''} &middot; ${r.timeAgo}
                    </p>
                    ${isMyReply ? `
                        <button class="btn-delete-reply" onclick="handleDeleteReply('${r.id}')" title="Delete my reply">
                            <i class="ph ph-trash"></i> Delete
                        </button>
                    ` : ''}
                </div>
                <p style="margin-bottom: 0; line-height: 1.5;">${escapeHtml(r.content)}</p>
            </div>
        </div>
        `;
    }).join('');
}

window.handleDeleteReply = function(replyId) {
    if (!confirm('Are you sure you want to delete this reply?')) {
        return;
    }
    const success = MOCK_DATA.deleteReply(currentDiscussionId, replyId);
    if (success) {
        const disc = MOCK_DATA.getDiscussion(currentDiscussionId);
        renderDiscussionReplies(disc);
    }
};

window.handlePostReply = function(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('replyContent');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const newReply = MOCK_DATA.addReply(currentDiscussionId, text);
    if (newReply) {
        input.value = '';
        const disc = MOCK_DATA.getDiscussion(currentDiscussionId);
        renderDiscussionReplies(disc);

        const newEl = document.getElementById(newReply.id);
        if (newEl) {
            newEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
};

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
