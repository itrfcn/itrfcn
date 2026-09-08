var posts=["posts/6931/","posts/2fd6/","posts/7eac/","posts/8ab6/","posts/9c16/","posts/c93f/","posts/ceca/","posts/1aa1/","posts/1a1/","posts/4d2b/","posts/9e72/","posts/f77d/","posts/b272/","posts/9f32/","posts/d3d/","posts/29b5/","posts/bf2c/","posts/3a52/","posts/83ea/","posts/516b/","posts/41ab/","posts/34af/","posts/17a1/","posts/5f08/","posts/3a56/","posts/8836/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };var friend_link_list=[{"name":"个人主页","link":"https://www.itrf.cn/","avatar":"/images/avatar.jpg","descr":"简单的介绍页","tag":"旗下网站"},{"name":"冈易云音乐","link":"https://mk.686909.xyz/","avatar":"https://mk.686909.xyz/favicon.ico","tag":"旗下网站","descr":"免费音乐网站"},{"name":"聚合影视","link":"https://tv.686909.xyz/","avatar":"https://tv.686909.xyz/image/logo.png","descr":"免费影视网站","tag":"旗下网站"},{"name":"BugPk-Api","link":"https://api.bugpk.com","avatar":"https://api.bugpk.com/favicon.ico","descr":"提供稳定、快速的免费API数据接口服务","siteshot":"https://t.alcy.cc/moez","color":"vip","tag":"技术"}];
    var friend_link_list_all=[{"name":"个人主页","link":"https://www.itrf.cn/","avatar":"/images/avatar.jpg","descr":"简单的介绍页","tag":"旗下网站"},{"name":"冈易云音乐","link":"https://mk.686909.xyz/","avatar":"https://mk.686909.xyz/favicon.ico","tag":"旗下网站","descr":"免费音乐网站"},{"name":"聚合影视","link":"https://tv.686909.xyz/","avatar":"https://tv.686909.xyz/image/logo.png","descr":"免费影视网站","tag":"旗下网站"},{"name":"BugPk-Api","link":"https://api.bugpk.com","avatar":"https://api.bugpk.com/favicon.ico","descr":"提供稳定、快速的免费API数据接口服务","siteshot":"https://t.alcy.cc/moez","color":"vip","tag":"技术"}];
    var refreshNum = 1;
    function friendChainRandomTransmission() {
      if (!friend_link_list_all.length) return;
      const randomIndex = Math.floor(Math.random() * friend_link_list_all.length);
      const { name, link } = friend_link_list_all[randomIndex];
      Snackbar.show({
        text:
          "点击前往按钮进入随机一个友链，不保证跳转网站的安全性和可用性。本次随机到的是本站友链：「" + name + "」",
        duration: 8000,
        pos: "top-center",
        actionText: "前往",
        onActionClick: function (element) {
          element.style.opacity = 0;
          window.open(link, "_blank");
        },
      });
    }
    function addFriendLinksInFooter() {
      var footerRandomFriendsBtn = document.getElementById("footer-random-friends-btn");
      if(!footerRandomFriendsBtn) return;
      footerRandomFriendsBtn.style.opacity = "0.2";
      footerRandomFriendsBtn.style.transitionDuration = "0.3s";
      footerRandomFriendsBtn.style.transform = "rotate(" + 360 * refreshNum++ + "deg)";
      const finalLinkList = [];
  
      let count = 0;

      while (friend_link_list.length && count < 3) {
        const randomIndex = Math.floor(Math.random() * friend_link_list.length);
        const { name, link, avatar } = friend_link_list.splice(randomIndex, 1)[0];
  
        finalLinkList.push({
          name,
          link,
          avatar,
        });
        count++;
      }
  
      let html = finalLinkList
        .map(({ name, link }) => {
          const returnInfo = "<a class='footer-item' href='" + link + "' target='_blank' rel='noopener nofollow'>" + name + "</a>"
          return returnInfo;
        })
        .join("");
  
      html += "<a class='footer-item' href='/link/'>更多</a>";

      document.getElementById("friend-links-in-footer").innerHTML = html;

      setTimeout(()=>{
        footerRandomFriendsBtn.style.opacity = "1";
      }, 300)
    };