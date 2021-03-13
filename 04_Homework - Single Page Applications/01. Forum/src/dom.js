export function generateTopic({ title, userName, postText, _id, subscribers, dateAndTime }) {
    const container = e('div', null, 'topic-container');
    const wrapper = e('div', null, 'topic-name-wrapper');
    const innerWrapper = e('div', null, 'topic-name');
    const headerWrapper = e('a', null, 'normal', { href: '#', id: _id });
    const header = e('h2', title);
    const content = e('p', postText, 'contentText');
    const bodyWrapper = e('div', null, 'columns');
    const body = e('div');
    const dateP = e('p', 'Date: ');
    const timeTag = e('time', dateAndTime);
    const usernameNameWrapper = e('div', null, 'nick-name');
    const usernameP = e('p', `Username: `);
    const userNameSpan = e('span', userName);

    const footer = e('div', null, 'subscribers');
    const subscribersP = e('p', `Subscribers: `);
    const subscribersSpan = e('span', subscribers);

    return build(
        container,
        build(
            wrapper,
            build(
                innerWrapper,
                build(headerWrapper, header, content),
                build(
                    bodyWrapper,
                    build(
                        body,
                        build(
                            build(dateP, timeTag),
                            build(usernameNameWrapper, build(usernameP, userNameSpan))
                        )
                    ),
                    build(footer, build(build(subscribersP, subscribersSpan)))
                )
            )
        )
    );
}

export function generateComment({ userName, commentContent, dateAndTime, likes }) {
    const wrapper = e('div', null, 'comment');
    const header = e('header', null, 'header');
    const userNameWrapper = e('p');
    userNameWrapper.innerHTML = `<span>${userName}</span> posted on <time>${dateAndTime}</time>`;
    const body = e('div', null, 'comment-main');
    const imgWrapper = e('div', null, 'userdetails');
    const img = e('img', null, null, { src: './static/profile.png', alt: 'avatar' });
    const contentWrapper = e('div', null, 'post-content');
    const content = e('p', commentContent);

    const footer = e('div', null, 'footer');
    const likesWrapper = e('p', likes > 1 ? `${likes} likes` : `${likes} like`);

    return build(
        wrapper,
        build(header, userNameWrapper),
        build(body, build(imgWrapper, img), build(contentWrapper, content)),
        build(footer, build(likesWrapper))
    );
}

export function e(type, txt, className, attributes, event) {
    const element = document.createElement(type);
    if (txt) {
        element.textContent = txt;
    }
    if (className) {
        element.className = className;
    }
    if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    }
    if (event) {
        element.addEventListener('click', event);
    }
    return element;
}

export function build(main, ...rest) {
    main.append(...rest);
    return main;
}
