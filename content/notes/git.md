---
title: Git
update_date: 2020-03-05
---

#### Push local changes to GitHub
The GitHub repo has already been initialized and the local and remote branches are in sync.
1. <code>git add .</code>
2. <code>git status</code>
3. <code>git commit -m "Commit comment"</code>
4. <code>git push origin master</code>

#### Start a new Git repository
1. Initialize local directory: <code>git init</code>
2. Add local repository: <code>git add &#60;option&#62;</code>
   * <code> <.> </code> everything in the current directory, same as <code>--all</code> or <code>-A</code>
   * <code>&#60;file&#62;</code> all changes in file.
   * <code>&#60;directory&#62;</code> all changes in the target directory.
   * <code>&#60;-p&#62;</code> interactive staging, let you choose files one by one.

3. Commit repository: <code>git commit -m "First commit message"</code>
4. Add remote repo URL (like GitHub): <code>git remote add origin https://.../your-repo.git</code>
5. Push local repo to GitHub: <code>git push -u origin master</code>
   * <code> <-u> </code> will remember your preferences for remote and branch and you can simply use the command <code>git push</code> next time.

#### Configure username & email
1. <code>git config --global user.name "FIRST_NAME LAST_NAME"</code>
2. <code>git config --global user.email "MY_NAME@example.com"</code>
   * Use <code> <--global> </code> if it's for every repo, dont use it if it's for a specific repo.

Display configuration file:
*<code>cat .git/config</code>

#### Show & change remote URL
1. Run <code>git remote -v</code> to list the existing remotes and see their names and URLs
   * The output will look something like this:  
          origin	https://github.com/user/repo_name.git (fetch)  
          origin	https://github.com/user/repo_name.git (push)

2. Run <code>git remote set-url</code> followed by the remote name and URL:
   * Example: <code>git remote set-url origin git@gitserver.com:user/repo_name.git</code>
   * The command updates the repository <code>.git/config</code> file with a new URL to the remote repository.
   * You can edit the file directly but should use the git command.
   * The remote’s URL can start with HTTPS or SSH (defaults to SSH if not specified). 
   * The URL can be found on the repository page of your Git hosting service.

3. Verify that the remote’s URL was successfully changed by listing it again with <code>git remote -v</code>

#### Update local branch with remote master
If your local branch is behind the remote master: 

* <code>git checkout [master/main]</code>
* <code>git pull</code>
* <code>git checkout [my-branch-which-is-behind]</code>
* <code>git merge master</code>

Git will ask for a commit message. 
