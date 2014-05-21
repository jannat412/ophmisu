package com.chattitude.app;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.ActionBarActivity;
import android.text.Html;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.chattitude.client.ChatApp;
import com.chattitude.client.Utils;


public class MainActivity extends ActionBarActivity
        implements NavigationDrawerFragment.NavigationDrawerCallbacks {

    public ChatApp app;
    public static MainActivity instance;
    EditText inputNickname = null;


    /**
     * Fragment managing the behaviors, interactions and presentation of the navigation drawer.
     */
    private NavigationDrawerFragment mNavigationDrawerFragment;

    /**
     * Used to store the last screen title. For use in {@link #restoreActionBar()}.
     */
    private CharSequence mTitle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        MainActivity.instance = this;

        setContentView(R.layout.activity_main);

        mNavigationDrawerFragment = (NavigationDrawerFragment)
                getSupportFragmentManager().findFragmentById(R.id.navigation_drawer);
        mTitle = getTitle();

        // Set up the drawer.
        mNavigationDrawerFragment.setUp(
                R.id.navigation_drawer,
                (DrawerLayout) findViewById(R.id.drawer_layout));



    }

    @Override
    public void onNavigationDrawerItemSelected(int position) {
        // update the main content by replacing fragments
        FragmentManager fragmentManager = getSupportFragmentManager();
        fragmentManager.beginTransaction()
                .replace(R.id.container, PlaceholderFragment.newInstance(position + 1))
                .commit();
    }

    public void onSectionAttached(int number) {
        switch (number) {
            case 1:
                mTitle = getString(R.string.title_section1);
                break;
            case 2:
                mTitle = getString(R.string.title_section2);
                break;
            case 3:
                mTitle = getString(R.string.title_section3);
                break;
        }
    }

    public void restoreActionBar() {
        ActionBar actionBar = getSupportActionBar();
        actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
        actionBar.setDisplayShowTitleEnabled(true);
        actionBar.setTitle(mTitle);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        if (!mNavigationDrawerFragment.isDrawerOpen()) {
            // Only show items in the action bar relevant to this screen
            // if the drawer is not showing. Otherwise, let the drawer
            // decide what to show in the action bar.
            getMenuInflater().inflate(R.menu.main, menu);
            restoreActionBar();
            return true;
        }
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }




    /**
     * A placeholder fragment containing a simple view.
     */
    public static class PlaceholderFragment extends Fragment {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_number";

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static PlaceholderFragment newInstance(int sectionNumber) {
            PlaceholderFragment fragment = new PlaceholderFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        public PlaceholderFragment() {
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                Bundle savedInstanceState) {
            int sectionNumber = Integer.parseInt(this.getArguments().get(ARG_SECTION_NUMBER).toString());
            View rootView = null;
            if (sectionNumber == 2)
                rootView = inflater.inflate(R.layout.fragment_chat, container, false);
            else if (sectionNumber == 3) {
                rootView = inflater.inflate(R.layout.fragment_chat, container, false);
                MainActivity.instance.exit();
            }
            else
            {
                if (MainActivity.instance != null && MainActivity.instance.app != null && MainActivity.instance.app.chat != null) MainActivity.instance.app.chat.disconnect();
                rootView = inflater.inflate(R.layout.fragment_main, container, false);
                MainActivity.instance.inputNickname = (EditText)rootView.findViewById(R.id.inputNickname);
                MainActivity.instance.inputNickname.setText(Utils.getDeviceName());
            }

            return rootView;
        }

        @Override
        public void onAttach(Activity activity) {
            super.onAttach(activity);
            ((MainActivity) activity).onSectionAttached(
                    getArguments().getInt(ARG_SECTION_NUMBER));


        }
    }





    public void addMessage(final String sender, final String message)
    {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {

                LinearLayout layout = (LinearLayout)MainActivity.instance.findViewById(R.id.layoutMessages);
                if (layout != null) {
                    TextView textView = new TextView(MainActivity.instance);
                    textView.setTextAppearance(MainActivity.instance, android.R.style.TextAppearance_Large);
                    textView.setText(Html.fromHtml("<b>" + sender + "</b> " + message));
                    layout.addView(textView);
                }
            }
        });
    }
    public void exit()
    {
        finish();
        System.exit(0);
    }
    public void showChat()
    {
        onNavigationDrawerItemSelected(1);
    }

    public void onConnectClickButton(View view)
    {
        app = new ChatApp();
        app.nickname = MainActivity.instance.inputNickname.getText().toString();
        app.chat.start();
    }

    public void onDisconnectButtonClick(View view)
    {
        if (this.app != null && this.app.chat != null) this.app.chat.disconnect();
        onNavigationDrawerItemSelected(0);
    }
    public void onClearButtonClick(View view)
    {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {

                LinearLayout layout = (LinearLayout)MainActivity.instance.findViewById(R.id.layoutMessages);
                if (layout != null) layout.removeAllViews();
            }
        });
    }
    public void onSendButtonClick(View view)
    {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                EditText editText = (EditText)findViewById(R.id.inputMessage);
                MainActivity.instance.app.chat.sendMessage(editText.getText().toString());
                MainActivity.instance.addMessage(MainActivity.instance.app.nickname, editText.getText().toString());
                editText.setText("");
            }
        });
    }

}
