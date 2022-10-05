If you want to a qui

### The Questionaire
**Question 1:**

How would you rate your computer competence and technical abilities, especially with respect to programming, software development, picking up new programs and technical skills, on a scale of 1 to ten? With 1 being totally incompetent, struggling to even turn a computer on and need help with every task. 10 being a skilled and seasoned programmer, that can pick up new programs and develop new software even when incredibly tired or intoxicated. This result is to be called by the variable $Q_1$.

**Question 2:**

How much time are you willing to invest on learning Linux and setting up a Linux system, on a scale of 1 to 10? 1 being no time, 10 being as long as it takes, even if it takes countless weeks of 10-hour days. This result is to be called by the variable $Q_2$.

**Question 3:**

How much past experience have you had with &#42;nix systems, including Apple's OS X on a scale of 1 to 10? With 1 being you have never even started a &#42;nix system and 10 being, they are all you use. This result is to be called by the variable $Q_3$.

**Question 4:**

How comfortable are you with the command-line (or command prompt on Windows)? Please also rate this one on a scale from 1 to 10. 1 being you have never even heard of the command-line and 10 being you are totally at-ease with it. This result is to be called by the variable $Q_4$.

**Question 5:**

How patient are you? Are you willing to be irritated by your computer not doing what you want it to, on an hourly basis? Please also rate this on a scale of 1 to 10. 1 being you are liable to throw your computer out the window at the first irritation and 10 being you are the master of this particular virtue. This result is to be called by the variable $Q_5$.

### The Results
Let us define:

$$ \begin{align} Q_{i,j} & = Q_i + Q_j & \\\\ Q_{i,j,k} & = Q_i + Q_j + Q_k & \\\\ Q_{i,j,k,l} & = Q_i + Q_j + Q_k + Q_l & \end{align} $$

and so forth. Then if:

$$ Q_{1,2} \geq 11 $$

or if:

$$ Q_{1,2,3} \geq 17 $$

Provided either of the above conditions are satisfied then if:

$$ 3 \lesssim Q_5 \lesssim 7 $$

your ideal operating system is likely Arch Linux. It has some of the best written documentation of any free &#42;nix system, but it does require you to build your system from the ground-up. This set up will likely take over an hour, if you want a GUI like KDE Plasma 5.

Else if:

$$ Q_5 \gtrsim 7 $$

then your ideal OS is likely Gentoo Linux. Alternatively if:

$$ Q_5 \lesssim 3 $$

then your ideal OS is likely CentOS, Debian, Fedora, Manjaro Linux, openSUSE or Sabayon Linux. If package development is important to you then you may prefer Manjaro Linux. CentOS and Debian are for those that want a particularly stable system, but are willing to use fairly old software. Fedora and openSUSE are for those that want a more up-to-date system, but still a fairly stable one. Manjaro and Sabayon Linux are for those that want a very up-to-date, but potentially-unstable system. Manjaro Linux has vaster software repositories, however, and superior free support.
