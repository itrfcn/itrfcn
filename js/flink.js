(function () {
    const cardSelector = "[data-remote-flink-url]";
    const bannerSelector = "[data-remote-flink-banner-url]";
    const requests = new Map();

    function getStatus(latency, reachable) {
        const value = Number(latency);
        if (reachable === false || !Number.isFinite(value) || value < 0) {
            return { text: "离线", className: "status-tag-red" };
        }

        const className = value <= 2
            ? "status-tag-green"
            : value <= 5
                ? "status-tag-light-yellow"
                : value <= 10
                    ? "status-tag-dark-yellow"
                    : "status-tag-red";

        return { text: `${value.toFixed(2)} s`, className };
    }

    function createCard(site) {
        if (!site || !site.link) return null;

        const item = document.createElement("div");
        item.className = "flink-list-item";

        const link = document.createElement("a");
        link.className = "cf-friends-link";
        link.href = site.link;
        link.target = "_blank";
        link.rel = "external nofollow";
        link.title = site.name || site.link;

        const avatar = document.createElement("img");
        avatar.className = "cf-friends-avatar no-lightbox";
        avatar.src = site.avatar || "/images/favicon.ico";
        avatar.alt = site.name || "友链头像";
        avatar.onerror = function () {
            this.onerror = null;
            this.src = "/images/favicon.ico";
        };

        const info = document.createElement("div");
        info.className = "flink-item-info";

        const name = document.createElement("div");
        name.className = "flink-item-name cf-friends-name";
        name.textContent = site.name || site.link;

        const description = document.createElement("div");
        description.className = "flink-item-desc";
        const status = getStatus(site.latency, site.reachable);
        description.textContent = site.reachable === false ? "暂时无法访问" : `访问延迟 ${status.text}`;

        const statusTag = document.createElement("span");
        statusTag.className = `status-tag ${status.className}`;
        statusTag.textContent = status.text;

        info.append(name, description);
        link.append(avatar, info);
        item.append(link, statusTag);
        return item;
    }

    function render(container, payload) {
        const sites = getSites(payload);
        const title = container.previousElementSibling;
        container.replaceChildren();

        if (title) title.textContent = `小伙伴 (${sites.length})`;

        sites.forEach(site => {
            const card = createCard(site);
            if (card) container.appendChild(card);
        });

        if (!sites.length) {
            const empty = document.createElement("div");
            empty.className = "remote-flink-message";
            empty.textContent = "暂无友链数据";
            container.appendChild(empty);
        }
    }

    function getSites(payload) {
        return Array.isArray(payload)
            ? payload
            : Array.isArray(payload && payload.link_data)
                ? payload.link_data
                : Array.isArray(payload && payload.link_status)
                    ? payload.link_status
                    : [];
    }

    function renderBanner(container, payload) {
        const wrapper = container.querySelector(".tags-group-wrapper");
        if (!wrapper) return;

        const sites = getSites(payload).filter(site => site && site.link).slice(0, 16);
        wrapper.replaceChildren();

        for (let index = 0; index < sites.length; index += 2) {
            const pair = document.createElement("div");
            pair.className = "tags-group-icon-pair";

            sites.slice(index, index + 2).forEach(site => {
                const link = document.createElement("a");
                link.className = "tags-group-icon no-text-decoration";
                link.href = site.link;
                link.target = "_blank";
                link.rel = "external nofollow";
                link.title = site.name || site.link;

                const image = document.createElement("img");
                image.className = "no-lightbox";
                image.src = site.avatar || "/images/favicon.ico";
                image.alt = site.name || "友链头像";
                image.title = image.alt;
                image.onerror = function () {
                    this.onerror = null;
                    this.src = "/images/favicon.ico";
                };

                link.appendChild(image);
                pair.appendChild(link);
            });
            wrapper.appendChild(pair);
        }
    }

    function showError(container) {
        container.replaceChildren();
        const message = document.createElement("div");
        message.className = "remote-flink-message";
        message.textContent = "友链数据加载失败，请稍后再试";
        container.appendChild(message);
    }

    function fetchSites(url) {
        if (!requests.has(url)) {
            requests.set(url, fetch(url, { cache: "no-store" })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                }));
        }
        return requests.get(url);
    }

    function loadRemoteLinks() {
        document.querySelectorAll(cardSelector).forEach(container => {
            const url = container.dataset.remoteFlinkUrl;
            if (!url || container.dataset.loading === "true") return;

            container.dataset.loading = "true";
            fetchSites(url)
                .then(payload => render(container, payload))
                .catch(error => {
                    console.error("远程友链加载失败:", error);
                    showError(container);
                })
                .finally(() => {
                    container.dataset.loading = "false";
                });
        });

        document.querySelectorAll(bannerSelector).forEach(container => {
            const url = container.dataset.remoteFlinkBannerUrl;
            if (!url || container.dataset.loading === "true") return;

            container.dataset.loading = "true";
            fetchSites(url)
                .then(payload => renderBanner(container, payload))
                .catch(error => console.error("远程友链横幅加载失败:", error))
                .finally(() => {
                    container.dataset.loading = "false";
                });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadRemoteLinks);
    } else {
        loadRemoteLinks();
    }
    document.addEventListener("pjax:complete", loadRemoteLinks);
})();