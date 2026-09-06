var posts=["posts/ceca/","posts/8ab6/","posts/9c16/","posts/34af/","posts/c93f/","posts/b272/","posts/9f32/","posts/9e72/","posts/83ea/","posts/bf2c/","posts/f77d/","posts/41ab/","posts/29b5/","posts/5f08/","posts/3a52/","posts/3a56/","posts/7eac/","posts/d3d/","posts/516b/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };var friend_link_list=[{"name":"个人主页","link":"https://www.itrf.cn/","avatar":"/images/avatar.jpg","descr":"简单的介绍页"},{"name":"冈易云音乐","link":"https://mk.686909.xyz/","avatar":"https://mk.686909.xyz/favicon.ico","descr":"免费音乐网站"},{"name":"聚合影视","link":"https://tv.686909.xyz/","avatar":"https://tv.686909.xyz/image/logo.png","descr":"免费影视网站"},{"name":"BugPk-Api","link":"https://api.bugpk.com","avatar":"https://api.bugpk.com/favicon.ico","descr":"提供稳定、快速的免费API数据接口服务","siteshot":"https://t.alcy.cc/moez","color":"vip","tag":"技术"}];
    var refreshNum = 1;
    function friendChainRandomTransmission() {
      const randomIndex = Math.floor(Math.random() * friend_link_list.length);
      const { name, link } = friend_link_list.splice(randomIndex, 1)[0];
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