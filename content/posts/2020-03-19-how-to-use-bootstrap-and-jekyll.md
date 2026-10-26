---
layout: post
title: How to use Bootstrap with Jekyll
---

Some years ago, I started messing with Jekyll for fun. I liked the idea that you can have your blog, with not a lot of coding, and especially that you can host it for free on GitHub. Something like Wordpress was overkill for what I wanted to do and Medium (which was not an annoying platform back in 2014) was slick and simple, but not customizable. A part of me wanted to create something.

When you first build a Jekyll site, it comes by default with <a href="https://jekyll.github.io/minima/" target="_blank">minima</a>. It may fit a lot of needs but I don't really like this theme. No offense to the creators, but it's not my taste. I started to use <a href="https://getbootstrap.com/docs/3.4/" target="_blank">Bootstrap 3</a> in 2014 and I enjoyed how you can use the prebuilt components and layout, thus, why not use it with Jekyll.

We could also use themes already packaged as <a href="https://guides.rubygems.org/" target="_blank">RubyGems</a>, even some with the Bootstrap framework already included but we would have the same problems; we can't easily change the features of the theme, we'll see why later.

Anyway, this should be simple to do, I mean, it's just some CSS, amarite?!

### Installing Jekyll & creating a new site

If you follow the official <a href="https://jekyllrb.com/docs/" target="_blank">Documentation</a> on how to install Jekyll, once the Ruby packages are installed, you create your site with the command `jekyll new my_blog`. Inside the newly created directory, we'll find the following files.

<div class="text-center">
  <img src="/assets/img/jekyll_01_my_blog_content.png" class="img-fluid" alt="Content of the new blog directory">
</div>

Wonder where the theme files are? Because besides `./_posts`, there are no other directories. Themes are not there because they are managed by some stupid RubyGems. I say stupid because while it's a great concept for more complex applications, a Jekyll website should remain the simplest form of a website there is and include, right off the bat, the CSS and JavaScript associated with the site. But hey, I'm not a Ruby developer, so my opinion is irrelevant! 

At least, we can go get these files elsewhere on our machine. Let's find where the theme is by running the command `bundle info --path minima` inside our `my_blog` directory. The output should look something like this.

<div class="text-center">
  <img src="/assets/img/jekyll_02_path_minima.png" class="img-fluid" alt="Result of bundle info --path minima">
</div>

And the content of the minima directory, like this.

<div class="text-center">
  <img src="/assets/img/jekyll_03_minima_content.png" class="img-fluid" alt="Content of the minima directory">
</div>

There is way more stuff that there used to be back in 2015. It seems like a lot for something that aims at being "simple", as stated in the title tag.

### Starting from scratch

Anyway, I don't care about minima and its features, so let's start from scratch following Jekyll's official <a href="https://jekyllrb.com/docs/step-by-step/01-setup/" target="_blank">step by step tutorial</a>. It's easy to follow and quick to finish. Once you're done, you'll end up with a project structure like the one below. It includes everything in a single directory, no RubyGems that are elsewhere on your machine or someone else machine (aka, the cloud).

<div class="text-center">
  <img src="/assets/img/jekyll_04_myblog_content.png" class="img-fluid" alt="Responsive image">
</div>

### Adding Bootstrap to the mix

As I understand per the <a href="https://jekyllrb.com/docs/step-by-step/07-assets/" target="_blank">tutorial</a>, in not technical terms:

1. When Jekyll build the site, it looks into the `./assets/` directory for CSS (and images, and JavaScript).
2. Inside `./assets/css/` we have `styles.scss`. 
3. The `styles.scss` file only contains front matter and a reference to what and where the actual CSS file is. In our case, we have `@import "main";`.
4. With this reference, Jekyll will look for a file called `main.scss` in our `./_sass/` directory.
5. Finally, in the `main.scss` file, we have the actual CSS code!

Understanding that, we can modify our newly created site to use Bootstrap. Let's download Bootstrap 4. Once we've unzip the file, we end up with all those <del><a href="https://www.youtube.com/watch?v=F-X4SLhorvw" target="_blank">chickens</a></del> files.

<div class="text-center">
  <img src="/assets/img/jekyll_05_bootstrap_content.png" class="img-fluid" alt="Bootstrap Zip Content">
</div>

You only really need `boostrap.css` and we need to change the `.css` extension to `.scss`. If we follow the same procedure:

1. Place the `bootstrap.scss` file (the one with the actual CSS code) inside the `./_sass/` directory.
2. Delete the old `main.scss`, it's no longer needed.
3. Modify the `./assets/css/styles.scss` file to `@import "bootstrap";` instead of `@import "main";` in order for Jekyll to know to look for our new CSS file by name.
4. Note that if we change the name of `styles.scss`, we also need to change the reference to it in the header of the `./_layouts/default.html` template HTML file. The extension needs to remain `.css` or else it will throw an error while building.

With this done, we can test our changes to make sure it works.

### Testing our changes

If the server is running (`jekyll serve`), Jekyll will regenerate our site (the `./_site` directory) as we make changes. We would need to restart it if we made changes to the `_config.yml` file but it's not the case here.

Before applying Bootstrap CSS.

<div class="text-center">
  <img src="/assets/img/jekyll_07_myblog_without_bootstrap.png" class="img-fluid" alt="Example of myblog without Bootstrap">
</div>

After applying Boostrap CSS.

<div class="text-center">
  <img src="/assets/img/jekyll_06_myblog_with_bootstrap.png" class="img-fluid" alt="Example of myblog with Bootstrap">
</div>

We can also add some Boostrap <a href="https://getbootstrap.com/docs/4.4/components/" target="_blank">components</a> by inserting the HTML code directly into Markdown files, into a post for example. Below, we have alerts and buttons in a blog post page.

<div class="text-center">
  <img src="/assets/img/jekyll_08_bootstrap_examples.png" class="img-fluid" alt="Testing Bootstrap Components">
</div>

Here we are, that seems to work fine! 

### Notes

The posts we write can be in Markdown (.md) or in HTML. It's more natural to use Markdown but it's a bit limited in terms of styling. I say limiting because if we take a look at this excellent <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown cheatsheet</a>, there is a lot that can be done with pure Markdown. But, for example:

* `target="_blank"` is not doable in Markdown, we need to use the the full `<a>` HTML <a href="https://www.w3schools.com/html/html_links.asp" target="_blank">tag</a>.
* Bootstrap `img-fluid` class is not applied when we use the Marldown way of insering picture, so we also need to use the full `<img>` HTML tag. There are <a href="https://www.xaprb.com/blog/how-to-style-images-with-markdown/" target="_blank">some ways</a> to circumvent this, but I haven't tested them.
* Still, Markdown inline code (<code>&#96;</code>) and code block (<code>&#96;&#96;&#96;</code>) notations will apply the same styling as if you would use native HTML/Boostrap notation, no need to use `<pre>` and `<code>`, expecet in some rare cases.

Finally, We don't have to use Bootstrap, we could use any CSS framework, the procedure is the same.

### Next steps

I would like to try to start from the minima template, the one created when you run `jekyll new my_blog`, and then replace it with Bootstrap without having to start from scratch like we did. But as seen earlier, I didn't have the patience to do so and my quick attempts have failed. Pepehands

I still have a problem using Boostrap JavaScript from a file, i.e., if it's not from a CDN. Maybe it's because I need to also download jQuery? Since I don't necessary need the Boostrap <a href="https://getbootstrap.com/docs/4.4/getting-started/introduction/#js" target="_blank">components</a> using JavaScript, I may not fix this.

## tl;dr

1. Rename `bootstrap.css` to `bootstrap.scss`.
2. Place `bootstrap.scss` inside the `./_sass/` directory.
3. Modify the `./assets/css/&#91;style.scss&#93;` file to `@import "bootstrap";`.
4. Make sure the reference in the header of the `./_layouts/default.html` HTML file reference the file in `./assets/css/` with a `css` extension.

<br>

Thanks for reading,